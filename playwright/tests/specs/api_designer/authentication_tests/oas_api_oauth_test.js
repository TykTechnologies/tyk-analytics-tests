import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

xtest('Test OAuth2.0 Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  let firstApi = false;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Test OAuth 2.0 default settings', async () => {
    let firstApi = true;
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oauth-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).toHaveAttribute('note', 'If selected the authorization response type will be automatically set to code');
    wdioExpect(apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX).toHaveAttribute('note', 'If selected the authorization response type will be automatically set to token');
    wdioExpect(apis_page.OAS_OAUTH_PASSWORD_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_PASSWORD_BOX).toHaveAttribute('note', 'If selected the authorization response type will be automatically set to token');
    wdioExpect(apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX).not.toBeChecked();
    let basicAuthUrl = $('a*=Learn more about Oauth 2.0');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/oauth-2-0/');
  });

  await test.step('Test OAuth 2.0 mandatory fields', async () => {
   await apis_page.OAS_SAVE_BUTTON.click();
    let grantTypesErrorMsg = $('//h4[text()="Allowed Grant Types"]//following::p[1]');
    let authConfigNameErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.name"]//p[1]');
    let authTokenLocationErrorMsg = $('//h4[text()="Authentication token location"]//following::p[1]');
    wdioExpect(authConfigNameErrorMsg).toHaveText('Authentication Configuration Name is required');
    wdioExpect(authTokenLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
    wdioExpect(grantTypesErrorMsg).toHaveText('Access Grant is required.');
   await apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    let loginRedirectErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]//following::p[1]');
    wdioExpect(loginRedirectErrorMsg).toHaveText("Authorization Login Redirect doesn't meet the proper URL format");
   await apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
   await apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    grantTypesErrorMsg = $('//h4[text()="Allowed Grant Types"]//following::p[1]');
    wdioExpect(grantTypesErrorMsg).toHaveText('Access Grant is required.');
  });

  await test.step('Test OAuth 2.0 URL validations', async () => {
    let firstApi = true;
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oauth-url-validation-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
   await apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
   await apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.fill('missing-protocol.com');
   await apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.fill('ws://wrong-protocol.com');
   await apis_page.OAS_SAVE_BUTTON.click();
    let loginRedirectErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]//following::p[1]');
    let notificationsUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.onKeyChangeUrl"]//following::p[1]');
    wdioExpect(loginRedirectErrorMsg).toHaveText("Authorization Login Redirect doesn't meet the proper URL format");
    wdioExpect(notificationsUrlErrorMsg).toHaveText("Notifications URL doesn't meet the proper URL format");
  });

  await test.step('User can save API with Authorization Code grant type', async () => {
    let firstApi = true;
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oauth-authorization-code-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
   await apis_page.OAS_OAUTH_CONFIG_NAME.fill("auth_code");
   await apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
   await apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.fill('https://redirect.com');
   await apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.fill('https://notification.com');
   await apis_page.OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT.fill('Abdsg9u234XFFOR9435898*&%&^%');
   await apis_page.OAS_OAUTH_USE_HEADER_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Authorization Code data is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OAUTH_NOTIFICATIONS_ACCORDTION.expand();
    const loginRedirectSaved = $('//span[text()="Login Redirect"]//following::div[2]');
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const notificationsUrlSaved = $('//span[text()="Notifications URL"]//following::div[2]');
    const notificationsSecretSaved = $('//span[text()="Notifications Shared Secret"]//following::div[2]');
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Oauth 2.0');
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_PASSWORD_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX).not.toBeChecked();
    wdioExpect(loginRedirectSaved).toHaveText('https://redirect.com');
    wdioExpect(notificationsUrlSaved).toHaveText('https://notification.com');
    wdioExpect(notificationsSecretSaved).toHaveText('Abdsg9u234XFFOR9435898*&%&^%');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization');
  });

  await test.step('User can modify Authorization Code data and Update API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.fill('http://new-redirect.com');
   await apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.fill('http://new-notification.com');
   await apis_page.OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT.fill('new-secret');
   await apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
   await apis_page.OAS_OAUTH_AUTH_HEADER_INPUT.fill('new-auth');
   await apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
   await apis_page.OAS_OAUTH_USE_COOKIE_BOX.click();
   await apis_page.OAS_OAUTH_COOKIE_VALUE_INPUT.fill('my-cookie');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Updated Authorization Code data is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OAUTH_NOTIFICATIONS_ACCORDTION.expand();
    const loginRedirectSaved = $('//span[text()="Login Redirect"]//following::div[2]');
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const cookieValueSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    const notificationsUrlSaved = $('//span[text()="Notifications URL"]//following::div[2]');
    const notificationsSecretSaved = $('//span[text()="Notifications Shared Secret"]//following::div[2]');
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Oauth 2.0');
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).toBeChecked();
    wdioExpect(loginRedirectSaved).toHaveText('http://new-redirect.com');
    wdioExpect(notificationsUrlSaved).toHaveText('http://new-notification.com');
    wdioExpect(notificationsSecretSaved).toHaveText('new-secret');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('new-auth');
    wdioExpect(cookieValueSaved).toHaveText('my-cookie');
  });

  await test.step('User can save API with Client Credentials grant type', async () => {
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oauth-client-credentials-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
   await apis_page.OAS_OAUTH_CONFIG_NAME.fill("client_creds");
   await apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX.click();
   await apis_page.OAS_OAUTH_USE_HEADER_BOX.click();
   await apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_OAUTH_QUERY_PARAM_INPUT.fill('my-param');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Authorization Code data is displayed after page reload', async () => {
    browser.refresh();
    const loginRedirectSaved = $('//span[text()="Login Redirect"]//following::div[2]');
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Oauth 2.0');
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_PASSWORD_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(loginRedirectSaved).not.toBeDisplayed();
    wdioExpect(queryParamNameSaved).toHaveText('my-param');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization');
  });

  await test.step('User can modify API and select multiple Grant types', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OAUTH_PASSWORD_BOX.click();
   await apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
   await apis_page.OAS_OAUTH_AUTH_HEADER_INPUT.fill('new-auth');
   await apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
   await apis_page.OAS_OAUTH_USE_COOKIE_BOX.click();
   await apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_OAUTH_COOKIE_VALUE_INPUT.fill('my-cookie');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Updated data is displayed after page reload', async () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const cookieValueSaved = $('//label[text()="Cookie Name"]//following::div[1]');
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Oauth 2.0');
    wdioExpect(apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_PASSWORD_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX).not.toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('new-auth');
    wdioExpect(cookieValueSaved).toHaveText('my-cookie');
  });

  function openInitPage(firstApi) {
    main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
  }

});
