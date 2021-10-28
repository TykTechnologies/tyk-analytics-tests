import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';
import { expect } from 'chai';

describe('Test Service Discovery settings on OAS API designer page', () => {
  let envDetails;
  let firstAPI = false;
  let queryEndpoint = 'http://service-discovery.com/endpoint';
  let targetPath = '/api-target-path';
  let timeout = 34;
  let portDataPath = '/port/path';
  let parentDataPath = 'parent';
  let dataPath = 'some.path';

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test default Service Discovery settings and mandatory fields', () => {
    let firstAPI = true;
    let apiName = 'default-values';
    openOasDesignerPage(firstAPI);
    expect(apis_page.OAS_ENABLE_SD_TOGGLE.isSelected()).to.be.false;
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    wdioExpect(apis_page.OAS_SD_PRESETS_DROPDOWN).toHaveText("Custom");
    apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
    apis_page.OAS_SD_VALUES_ARE_NESTED_BOX.click();
    createApi(apiName);
    apis_page.SIDE_MENU_SERVER_LINK.click();
    let queryEndpointErrorMessage = $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.queryEndpoint"]//following::p[1]');
    let portDataPathErrorMessage = $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.portDataPath"]//following::p[1]');
    let parentDataPathErrorMessage = $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.parentDataPath"]//following::p[1]');
    let dataPathErrorMessage = $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.dataPath"]//following::p[1]');
    wdioExpect(queryEndpointErrorMessage).toHaveText('Query Endpoint is required');  
    wdioExpect(portDataPathErrorMessage).toHaveText('Port Data Path is required');  
    wdioExpect(parentDataPathErrorMessage).toHaveText('Parent Data Path is required');  
    wdioExpect(dataPathErrorMessage).toHaveText('Data Path is required');  
  });

  it('User can save API with Custom Preset', () => {
    let firstAPI = true;
    let apiName = 'custom-sd-preset';
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    apis_page.OAS_SD_TARGET_PATH_INPUT.setValue(targetPath);
    apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX.click();
    apis_page.OAS_SD_CACHE_TIMEOUT_INPUT.setValue(timeout);
    apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX.click();
    apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX.click();
    apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
    apis_page.OAS_SD_PORT_DATA_PATH_INPUT.setValue(portDataPath);
    apis_page.OAS_SD_VALUES_ARE_NESTED_BOX.click();
    apis_page.OAS_SD_PARENT_DATA_PATH_INPUT.setValue(parentDataPath);
    apis_page.OAS_SD_DATA_PATH_INPUT.setValue(dataPath);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Custom data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText(targetPath);
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('34');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText(portDataPath);
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText(parentDataPath);
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText(dataPath);
  });

  it('User can edit and modify API with Custom Preset', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint + "_new");
    apis_page.OAS_SD_TARGET_PATH_INPUT.setValue(targetPath + "_new");
    apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX.click();
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX.click();
    apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX.click();
    apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
    apis_page.OAS_SD_PARENT_DATA_PATH_INPUT.setValue(parentDataPath + "_new");
    apis_page.OAS_SD_DATA_PATH_INPUT.setValue(dataPath + "_new");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Modified data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint + "_new");
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText(targetPath + "_new");
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).not.toBeChecked();
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText(parentDataPath + "_new");
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText(dataPath + "_new");
  });

  it('User can save API with Consul Preset', () => {
    let apiName = "consul-preset";
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Consul");
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Consul data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText("-");
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('20');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('ServicePort');
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('Address');
  });

  it('User can save API with Mesosphere Preset', () => {
    let apiName = "mesosphere-preset";
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Mesosphere");
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Mesosphere data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('ports');
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('tasks');
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('host');
  });

  it('User can save API with Single ETCD Preset', () => {
    let apiName = "single-etcd-preset";
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Single ETCD");
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Single ETCD data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('node.value');
  });

  it('User can save API with Nested ETCD Preset', () => {
    let apiName = "nested-etcd-preset";
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Nested ETCD");
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Nested ETCD data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('port');
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('node.value');
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('hostname');
  });

  it('User can save API with Eureka Preset', () => {
    let apiName = "eureka-preset";
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_SD_TOGGLE.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Eureka");
    apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.setValue(queryEndpoint);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Eureka data is saved after reloading page', () => {  
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    wdioExpect(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    wdioExpect(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('port.$');
    wdioExpect(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('application.instance');
    wdioExpect(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('hostName');
  });

  function openOasDesignerPage(firstApi) {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.OAS_ADD_API_BUTTON.click();;
    apis_page.API_NAME_INPUT.setValue('service-discovery-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
    apis_page.SIDE_MENU_BASE_LINK.click();
    apis_page.API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_SAVE_BUTTON.click();
  }
  
});