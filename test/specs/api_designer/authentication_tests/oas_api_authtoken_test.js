import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { URL, LANDING_PAGE_PATH } from './../../../../config_variables';
import { expect } from 'chai';

describe('Test Auth Token Authentication in OAS API designer page', () => {
  let envDetails;
  
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test Auth Token default settings', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('authToken-header-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
    wdioExpect(apis_page.OAS_AUTH_TOKEN_CONFIG_NAME).toHaveText('');
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked;
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked;
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked;
    let basicAuthUrl = $('a*=Learn more about Auth Token');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/');
  });

  it('Test Auth Token mandatory fields', () => {
    apis_page.OAS_SAVE_BUTTON.click();
    let authConfigNameErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//p[1]');
    let authTokenLocationErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//following::p[2]');
    wdioExpect(authConfigNameErrorMsg).toHaveText('Authentication Configuration Name is required');
    wdioExpect(authTokenLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
  });

  it('User can save Auth Token API with token in header', () => {
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.setValue("my_auth");
    apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX.click();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT).toHaveValue("Authorization");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Auth Token with token in header is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_CONFIG_NAME_SAVED).toHaveText("my_auth");
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_SAVED).toHaveText("Authorization");
  });

  it('User can save Auth Token API with token in query', () => {
    main_page.openAPIs();
    apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('authToken-query-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
    apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.setValue("my_auth");
    apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX.click();
    apis_page.OAS_AUTH_TOKEN_QUERY_NAME_INPUT.setValue("custom_param");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Auth Token with token in query is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_QUERY_NAME_SAVED).toHaveText("custom_param");
  });

  it('User can save Auth Token API with token in cookie', () => {
    main_page.openAPIs();
    apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('authToken-cookie-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
    apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.setValue("my_auth");
    apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX.click();
    apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_INPUT.setValue("custom_cookie");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Auth Token with token in cookie is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_SAVED).toHaveText("custom_cookie");
  });

  it('User can modify Auth Token data and update API', () => {
    main_page.openAPIs();
    let apiLink = $('span=authToken-header-test');
    apiLink.click();
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT.setValue("custom_header");
    apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX.click();
    apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_INPUT.setValue("custom_cookie");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Auth Token data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_SAVED).toHaveText("custom_cookie");
    wdioExpect(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_SAVED).toHaveText("custom_header");
  });

});
