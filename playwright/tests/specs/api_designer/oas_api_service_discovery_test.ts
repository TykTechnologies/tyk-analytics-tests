import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';

import { expect } from 'chai';
import waitForClickable from 'webdriverio/build/commands/element/waitForClickable';

xtest('Test Service Discovery settings on OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  
  let firstAPI = false;
  let queryEndpoint = 'http://service-discovery.com/endpoint';
  let targetPath = '/api-target-path';
  let timeout = 34;
  let portDataPath = '/port/path';
  let parentDataPath = 'parent';
  let dataPath = 'some.path';

  
  await test.step('Test default Service Discovery settings and mandatory fields', async () => {
    let firstAPI = true;
    let apiName = 'default-values';
    await openOasDesignerPage(firstAPI);
    assert(await apis_page.OAS_ENABLE_SD_TOGGLE.isSelected()).toBeFalsy();
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
    await assert(apis_page.OAS_SD_PRESETS_DROPDOWN).toHaveText("Custom");
   await apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
   await apis_page.OAS_SD_VALUES_ARE_NESTED_BOX.click();
    await createApi(apiName);
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    let queryEndpointErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.queryEndpoint"]//following::p[1]');
    let portDataPathErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.portDataPath"]//following::p[1]');
    let parentDataPathErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.parentDataPath"]//following::p[1]');
    let dataPathErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.dataPath"]//following::p[1]');
    await assert(queryEndpointErrorMessage).toHaveText('Query Endpoint is required');  
    await assert(portDataPathErrorMessage).toHaveText('Port Data Path is required');  
    await assert(parentDataPathErrorMessage).toHaveText('Parent Data Path is required');  
    await assert(dataPathErrorMessage).toHaveText('Data Path is required');  
  });

  await test.step('User can save API with Custom Preset', async () => {
    let firstAPI = true;
    let apiName = 'custom-sd-preset';
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
   await apis_page.OAS_SD_TARGET_PATH_INPUT.fill(targetPath);
   await apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX.click();
   await apis_page.OAS_SD_CACHE_TIMEOUT_INPUT.fill(timeout);
   await apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX.click();
   await apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX.click();
   await apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
   await apis_page.OAS_SD_PORT_DATA_PATH_INPUT.fill(portDataPath);
   await apis_page.OAS_SD_VALUES_ARE_NESTED_BOX.click();
   await apis_page.OAS_SD_PARENT_DATA_PATH_INPUT.fill(parentDataPath);
   await apis_page.OAS_SD_DATA_PATH_INPUT.fill(dataPath);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Custom data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText(targetPath);
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('34');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText(portDataPath);
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText(parentDataPath);
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText(dataPath);
  });

  await test.step('User can edit and modify API with Custom Preset', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint + "_new");
   await apis_page.OAS_SD_TARGET_PATH_INPUT.fill(targetPath + "_new");
   await apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX.click();
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
   await apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX.click();
   await apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX.click();
   await apis_page.OAS_SD_PORT_IS_SEPARATE_BOX.click();
   await apis_page.OAS_SD_PARENT_DATA_PATH_INPUT.fill(parentDataPath + "_new");
   await apis_page.OAS_SD_DATA_PATH_INPUT.fill(dataPath + "_new");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Modified data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint + "_new");
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText(targetPath + "_new");
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).not.toBeChecked();
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText(parentDataPath + "_new");
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText(dataPath + "_new");
  });

  await test.step('User can save API with Consul Preset', async () => {
    let apiName = "consul-preset";
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Consul");
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Consul data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText("-");
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('20');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('ServicePort');
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('Address');
  });

  await test.step('User can save API with Mesosphere Preset', async () => {
    let apiName = "mesosphere-preset";
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Mesosphere");
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Mesosphere data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('ports');
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('tasks');
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('host');
  });

  await test.step('User can save API with Single ETCD Preset', async () => {
    let apiName = "single-etcd-preset";
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Single ETCD");
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Single ETCD data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('node.value');
  });

  await test.step('User can save API with Nested ETCD Preset', async () => {
    let apiName = "nested-etcd-preset";
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Nested ETCD");
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Nested ETCD data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('port');
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('node.value');
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('hostname');
  });

  await test.step('User can save API with Eureka Preset', async () => {
    let apiName = "eureka-preset";
    await openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_SD_TOGGLE.click();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
   await apis_page.OAS_SD_PRESETS_DROPDOWN.selectOption("Eureka");
   await apis_page.OAS_SD_QUERY_ENDPOINT_INPUT.fill(queryEndpoint);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Eureka data is saved after reloading page', async () => {  
    await page.reload();
   await apis_page.SIDE_MENU_UPSTREAM_LINK.click();
    await assert(apis_page.OAS_SD_QUERY_ENDPOINT_SAVED).toHaveText(queryEndpoint);
    await assert(apis_page.OAS_SD_TARGET_PATH_SAVED).toHaveText('/api-slug');
    await assert(apis_page.OAS_SD_ENABLE_CACHE_TIMEOUT_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_CACHE_TIMEOUT_SAVED).toHaveText('60');
    await apis_page.OAS_SD_RESPONSE_CONFIG_ACCORDTION.expand();
    await assert(apis_page.OAS_SD_ENDPOINT_RETURNS_LIST_BOX).not.toBeChecked();
    await assert(apis_page.OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_IS_SEPARATE_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PORT_DATA_PATH_SAVED).toHaveText('port.$');
    await assert(apis_page.OAS_SD_VALUES_ARE_NESTED_BOX).toBeChecked();
    await assert(apis_page.OAS_SD_PARENT_DATA_PATH_SAVED).toHaveText('application.instance');
    await assert(apis_page.OAS_SD_DATA_PATH_SAVED).toHaveText('hostName');
  });

  function openOasDesignerPage(firstApi) {
    await main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('service-discovery-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
   await apis_page.SIDE_MENU_BASE_LINK.click();
  await apis_page.API_NAME_INPUT.waitFor();
   await apis_page.API_NAME_INPUT.fill(apiName);
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_SAVE_BUTTON.click();
  }
  
});
