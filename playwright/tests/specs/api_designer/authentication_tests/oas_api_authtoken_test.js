import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

test('Test Auth Token Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Test Auth Token default settings', async () => {
    await main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('authToken-header-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
    await assert(apis_page.OAS_AUTH_TOKEN_CONFIG_NAME).toHaveText('');
    await assert(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked;
    await assert(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked;
    await assert(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked;
    let basicAuthUrl = $('a*=Learn more about Auth Token');
    await assert(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/');
  });

  await test.step('Test Auth Token mandatory fields', async () => {
   await apis_page.OAS_SAVE_BUTTON.click();
    let authConfigNameErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//p[1]');
    let authTokenLocationErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//following::p[2]');
    await assert(authConfigNameErrorMsg).toHaveText('Authentication Configuration Name is required');
    await assert(authTokenLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
  });

  await test.step('User can save Auth Token API with token in header', async () => {
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.fill("my_auth");
   await apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX.click();
    await assert(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT).toHaveValue("Authorization");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Auth Token with token in header is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_AUTH_TOKEN_CONFIG_NAME_SAVED).toHaveText("my_auth");
    await assert(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_SAVED).toHaveText("Authorization");
  });

  await test.step('User can save Auth Token API with token in query', async () => {
    await main_page.openAPIs();
   await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('authToken-query-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
   await apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.fill("my_auth");
   await apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX.click();
   await apis_page.OAS_AUTH_TOKEN_QUERY_NAME_INPUT.fill("custom_param");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Auth Token with token in query is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_QUERY_NAME_SAVED).toHaveText("custom_param");
  });

  await test.step('User can save Auth Token API with token in cookie', async () => {
    await main_page.openAPIs();
   await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('authToken-cookie-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Auth Token");
   await apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.fill("my_auth");
   await apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX.click();
   await apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_INPUT.fill("custom_cookie");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Auth Token with token in cookie is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_SAVED).toHaveText("custom_cookie");
  });

  await test.step('User can modify Auth Token data and update API', async () => {
    await main_page.openAPIs();
    let apiLink = this.page.locator('p').filter({ hasText: 'authToken-header-test' });
    apiLink.click();
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT.fill("custom_header");
   await apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX.click();
   await apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_INPUT.fill("custom_cookie");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Auth Token data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_QUERY_BOX).not.toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX).toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_USE_COOKIE_BOX).toBeChecked();
    await assert(apis_page.OAS_AUTH_TOKEN_COOKIE_NAME_SAVED).toHaveText("custom_cookie");
    await assert(apis_page.OAS_AUTH_TOKEN_HEADER_NAME_SAVED).toHaveText("custom_header");
  });

});
