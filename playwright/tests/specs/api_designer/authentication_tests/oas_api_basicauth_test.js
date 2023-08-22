import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

test('Test Basic Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Test Basic Auth default settings', async () => {
    main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('basic-auth-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Basic Authentication");
    wdioExpect(apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_BASICAUTH_CACHE_TTL_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX).not.toBeChecked();
    let basicAuthUrl = $('a*=Learn more about Basic Authentication');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/basic-auth/');
  });

  await test.step('Test Basic Auth mandatory fields', async () => {
   await apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
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

  await test.step('User can save API with Basic Auth settings', async () => {
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_BASICAUTH_CONFIG_NAME.fill('basicAuth');
   await apis_page.OAS_BASICAUTH_CACHE_TTL_INPUT.fill('40');
   await apis_page.OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX.click();
   await apis_page.OAS_BASICAUTH_REGEXP_USERNAME_INPUT.fill('<User>(.*)</User>');
   await apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_INPUT.fill('<Pass>(.*)</Pass>');
   await apis_page.OAS_BASICAUTH_USE_HEADER_BOX.click();
   await apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX.click();
   await apis_page.OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_BASICAUTH_QUERY_PARAM_INPUT.fill('my-param');
   await apis_page.OAS_BASICAUTH_USE_COOKIE_BOX.click();
   await apis_page.OAS_BASICAUTH_COOKIE_VALUE_INPUT.fill('my-cookie');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Basic Auth data is saved correclty and displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
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

  await test.step('User can modify Basic Auth data and Update API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_BASICAUTH_ENABLE_CHACHING_BOX.click();
   await apis_page.OAS_BASICAUTH_REGEXP_USERNAME_INPUT.fill('<Users>(.*)</Users>');
   await apis_page.OAS_BASICAUTH_REGEXP_PASSWORD_INPUT.fill('<Passwords>(.*)</Passwords>');
   await apis_page.OAS_BASICAUTH_AUTH_HEADER_INPUT.fill('new-auth');
   await apis_page.OAS_BASICAUTH_STRIP_AUTHDATA_BOX.click();
   await apis_page.OAS_BASICAUTH_QUERY_PARAM_INPUT.fill('new-param');
   await apis_page.OAS_BASICAUTH_USE_COOKIE_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Updated Basic Auth data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
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