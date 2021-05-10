import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';
import { expect } from 'chai';

describe('Test CORS settings on OAS API designer page', () => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User can see default CACHE settings', () => {
    openOasDesignerPage();
    expect(apis_page.OAS_ENABLE_CACHE_TOGGLE.isSelected()).to.be.true;
    wdioExpect(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CACHE_TIMEOUT_INPUT).toHaveValue("60");
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).toHaveText("");
    wdioExpect(apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN).toHaveText("");
    wdioExpect(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT).toHaveValue("");
  });

  it('User can save API with default CACHE values', () => {
    let apiName = "default-cache"
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Enable Upstream Cache Control disables other CACHE settings', () => {  
    openOasDesignerPage();
    apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    cacheUpstreamCacheControlHidesOtherElements();
  });

  it('User can save API with enabled Enable Upstream Cache Control', () => {
    let apiName = "upstream-cache-control"
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Enable Upstream Cache Control is persistent after reloading the page', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    cacheUpstreamCacheControlHidesOtherElements();
  });

  it('User can change Cache Timeout and save API', () => {
    let apiName = 'cache-timeout'
    openOasDesignerPage();
    apis_page.OAS_CACHE_TIMEOUT_INPUT.setValue("44");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Timeout is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_TIMEOUT_SAVED).toHaveText("44");
  });

  it('User can set Cache Response Codes and save API', () => {
    let apiName = 'cache-response-codes'
    openOasDesignerPage();
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.selectOptions(["200 OK", "403 Forbidden"]); //direct select
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("410"); //input and match from dropdown
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("299"); //free input custom value
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Response Codes are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_SAVED).toHaveText("200, 403, 410, 299");
  });

  it('Cache Response Codes are properly displayed in API Edit mode', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).toHaveText("200 OK\n403 Forbidden\n410 Gone\n299");
  });

  it('User can set Cache All Safe Requests and save API', () => {
    let apiName = 'cache-all-safe-requests'
    openOasDesignerPage();
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
    let apiName = 'cache-by-headers'
    openOasDesignerPage();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.click();
    apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-1");
    apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-2");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache by Headers are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_BY_HEADERS_SAVED).toHaveText("header-1, header-2");
  });

  it('User can set Cache Control TTL Header and save API', () => {
    let apiName = 'cache-ttl-header'
    openOasDesignerPage();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.click();
    apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT.setValue("header-ttl");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Cache Control TTL Header is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_SAVED).toHaveText("header-ttl");
  });

  function openOasDesignerPage() {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    apis_page.DESIGN_API_BOX.click();
    apis_page.OAS_API_NAME_INPUT.setValue('cache-test');
    apis_page.OAS_NEXT_BUTTON.click();
  }

  function createApi(apiName) {
    apis_page.SIDE_MENU_BASE_LINK.click();
    apis_page.OAS_API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_TARGET_URL_INPUT.setValue("http://httpbin.org");
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Keyless");
    apis_page.OAS_SAVE_BUTTON.click();
  }

  function cacheUpstreamCacheControlHidesOtherElements() {
    wdioExpect(apis_page.OAS_CACHE_TIMEOUT_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT).not.toBeDisplayed();
  }

});