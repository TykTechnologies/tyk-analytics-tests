import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';

xdescribe('Test CACHE settings on OAS API designer page', () => {
  let envDetails;
  let firstAPI = false;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('CACHE settings is off by default', () => {
    let firstAPI = true;
    openOasDesignerPage(firstAPI);
    expect(apis_page.OAS_ENABLE_CACHE_TOGGLE.isSelected()).to.be.false;
  });

  it('User can change Cache Timeout and save API', () => {
    let firstAPI = true;
    let apiName = 'cache-timeout';
    openOasDesignerPage(firstAPI);
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    apis_page.OAS_CACHE_TIMEOUT_INPUT.setValue("44");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Timeout is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_CACHE_TIMEOUT_SAVED).toHaveText("44");
  });

  it('User can set Cache Response Codes and save API', () => {
    let apiName = 'cache-response-codes';
    openOasDesignerPage(firstAPI);
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.selectOptions(["200 OK", "403 Forbidden"]); //direct select
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("410"); //input and match from dropdown
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("299"); //free input custom value
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Response Codes are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_SAVED).toHaveText("200 OK, 403 Forbidden, 410 Gone, 299");
  });

  it('Cache Response Codes are properly displayed in API Edit mode', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).toHaveText("200 OK\n403 Forbidden\n410 Gone\n299");
  });

  it('User can set Cache All Safe Requests and save API', () => {
    let apiName = 'cache-all-safe-requests';
    openOasDesignerPage(firstAPI);
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX.click();
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache All Safe Requests is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX).toBeChecked();
  });
  
  it('User can set Cache by Headers and save API', () => {
    let apiName = 'cache-by-headers';
    openOasDesignerPage(firstAPI);
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-1");
    apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-2");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache by Headers are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    wdioExpect(apis_page.OAS_CACHE_BY_HEADERS_SAVED).toHaveText("header-1, header-2");
  });

  it('User can set Cache Control TTL Header and save API', () => {
    let apiName = 'cache-ttl-header';
    openOasDesignerPage(firstAPI);
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT.setValue("header-ttl");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Control TTL Header is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    wdioExpect(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_SAVED).toHaveText("header-ttl");
  });

  function openOasDesignerPage(firstApi) {
    main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('cache-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
    apis_page.SIDE_MENU_BASE_LINK.click();
    apis_page.API_NAME_INPUT.waitForClickable();
    apis_page.API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_SAVE_BUTTON.click();
  }

});
