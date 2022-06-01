import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

describe('Test Basic Authentication in OAS API designer page', () => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test Basic Auth default settings', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('basic-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Basic Authentication");
    wdioExpect(apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_CACHE_TTL_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX).not.toBeChecked();
    let basicAuthUrl = $('a*=Learn more about Basic Authentication');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/basic-auth/');
  });

  it('Test Basic Auth mandatory fields', () => {
    apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    let cacheTtlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cacheTTL"]//following::p[2]');
    let regexpUserErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.userRegexp"]//following::p[1]');
    let regexpPasswordErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.passwordRegexp"]//following::p[1]');
    let basicAuthConfigNameErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.name"]//p[1]');
    let basicAuthLocationErrorMsg = $('//h4[text()="Authentication token location"]//following::p[1]');
    wdioExpect(basicAuthConfigNameErrorMsg).toHaveText('Authentication Configuration Name is required');
    wdioExpect(basicAuthLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
    wdioExpect(cacheTtlErrorMsg).toHaveText('Cache TTL is required');
    wdioExpect(regexpUserErrorMsg).toHaveText('Regexp to Extract Username is required');
    wdioExpect(regexpPasswordErrorMsg).toHaveText('Regexp to Extract Password is required');
  });

  it('User can save API with Basic Auth settings', () => {
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_BASICAUTH_CONFIG_NAME.setValue('basicAuth');
    apis_page.OAS_BASICAUTH_CACHE_TTL_INPUT.setValue('40');
    apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX.click();
    apis_page.OAS_BASICAUTH_REGEXP_USERNAME_INPUT.setValue('<User>(.*)</User>');
    apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_INPUT.setValue('<Pass>(.*)</Pass>');
    apis_page.OAS_BASICAUTH_USE_HEADER_BOX.click();
    apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX.click();
    apis_page.OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_BASICAUTH_QUERY_PARAM_INPUT.setValue('my-param');
    apis_page.OAS_BASICAUTH_USE_COOKIE_BOX.click();
    apis_page.OAS_BASICAUTH_COOKIE_VALUE_INPUT.setValue('my-cookie');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Basic Auth data is saved correclty and displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Basic Authentication');
    wdioExpect(apis_page.OAS_BASICAUTH_CONFIG_NAME_SAVED).toHaveText('basicAuth');
    wdioExpect(apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_CACHE_TTL_SAVED).toHaveText('40');
    wdioExpect(apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_REGEXP_USERNAME_SAVED).toHaveText('<User>(.*)</User>');
    wdioExpect(apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_SAVED).toHaveText('<Pass>(.*)</Pass>');
    wdioExpect(apis_page.OAS_BASICAUTH_AUTH_HEADER_SAVED).toHaveText('Authorization');
    wdioExpect(apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_QUERY_PARAM_SAVED).toHaveText('my-param');
    wdioExpect(apis_page.OAS_BASICAUTH_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_COOKIE_VALUE_SAVED).toHaveText('my-cookie');
  });

  it('User can modify Basic Auth data and Update API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX.click();
    apis_page.OAS_BASICAUTH_REGEXP_USERNAME_INPUT.setValue('<Users>(.*)</Users>');
    apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_INPUT.setValue('<Passwords>(.*)</Passwords>');
    apis_page.OAS_BASICAUTH_AUTH_HEADER_INPUT.setValue('new-auth');
    apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX.click();
    apis_page.OAS_BASICAUTH_QUERY_PARAM_INPUT.setValue('new-param');
    apis_page.OAS_BASICAUTH_USE_COOKIE_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Basic Auth data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_CACHE_TTL_SAVED).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_REGEXP_USERNAME_SAVED).toHaveText('<Users>(.*)</Users>');
    wdioExpect(apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_SAVED).toHaveText('<Passwords>(.*)</Passwords>');
    wdioExpect(apis_page.OAS_BASICAUTH_AUTH_HEADER_SAVED).toHaveText('new-auth');
    wdioExpect(apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_QUERY_PARAM_SAVED).toHaveText('new-param');
    wdioExpect(apis_page.OAS_BASICAUTH_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_COOKIE_VALUE_SAVED).not.toBeDisplayed();
  });

});