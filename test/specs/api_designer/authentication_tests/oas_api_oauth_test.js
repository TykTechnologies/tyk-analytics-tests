import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

xdescribe('Test OAuth2.0 Authentication in OAS API designer page', () => {
  let envDetails;
  let firstApi = false;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test OAuth 2.0 default settings', () => {
    let firstApi = true;
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oauth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
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

  it('Test OAuth 2.0 mandatory fields', () => {
    apis_page.OAS_SAVE_BUTTON.click();
    let grantTypesErrorMsg = $('//h4[text()="Allowed Grant Types"]//following::p[1]');
    let authConfigNameErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.name"]//p[1]');
    let authTokenLocationErrorMsg = $('//h4[text()="Authentication token location"]//following::p[1]');
    wdioExpect(authConfigNameErrorMsg).toHaveText('Authentication Configuration Name is required');
    wdioExpect(authTokenLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
    wdioExpect(grantTypesErrorMsg).toHaveText('Access Grant is required.');
    apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    let loginRedirectErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]//following::p[1]');
    wdioExpect(loginRedirectErrorMsg).toHaveText("Authorization Login Redirect doesn't meet the proper URL format");
    apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
    apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    grantTypesErrorMsg = $('//h4[text()="Allowed Grant Types"]//following::p[1]');
    wdioExpect(grantTypesErrorMsg).toHaveText('Access Grant is required.');
  });

  it('Test OAuth 2.0 URL validations', () => {
    let firstApi = true;
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oauth-url-validation-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
    apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
    apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.setValue('missing-protocol.com');
    apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.setValue('ws://wrong-protocol.com');
    apis_page.OAS_SAVE_BUTTON.click();
    let loginRedirectErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]//following::p[1]');
    let notificationsUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.onKeyChangeUrl"]//following::p[1]');
    wdioExpect(loginRedirectErrorMsg).toHaveText("Authorization Login Redirect doesn't meet the proper URL format");
    wdioExpect(notificationsUrlErrorMsg).toHaveText("Notifications URL doesn't meet the proper URL format");
  });

  it('User can save API with Authorization Code grant type', () => {
    let firstApi = true;
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oauth-authorization-code-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
    apis_page.OAS_OAUTH_CONFIG_NAME.setValue("auth_code");
    apis_page.OAS_OAUTH_AUTHORIZATION_CODE_BOX.click();
    apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.setValue('https://redirect.com');
    apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.setValue('https://notification.com');
    apis_page.OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT.setValue('Abdsg9u234XFFOR9435898*&%&^%');
    apis_page.OAS_OAUTH_USE_HEADER_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Authorization Code data is displayed after page reload', () => {
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

  it('User can modify Authorization Code data and Update API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OAUTH_LOGIN_REDIRECT_INPUT.setValue('http://new-redirect.com');
    apis_page.OAS_OAUTH_NOTIFICATIONS_URL_INPUT.setValue('http://new-notification.com');
    apis_page.OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT.setValue('new-secret');
    apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
    apis_page.OAS_OAUTH_AUTH_HEADER_INPUT.setValue('new-auth');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_OAUTH_USE_COOKIE_BOX.click();
    apis_page.OAS_OAUTH_COOKIE_VALUE_INPUT.setValue('my-cookie');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Authorization Code data is displayed after page reload', () => {
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

  it('User can save API with Client Credentials grant type', () => {
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oauth-client-credentials-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Oauth 2.0");
    apis_page.OAS_OAUTH_CONFIG_NAME.setValue("client_creds");
    apis_page.OAS_OAUTH_CLIENT_CREDENTIALS_BOX.click();
    apis_page.OAS_OAUTH_USE_HEADER_BOX.click();
    apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_OAUTH_QUERY_PARAM_INPUT.setValue('my-param');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Authorization Code data is displayed after page reload', () => {
    browser.refresh();
    const loginRedirectSaved = $('//span[text()="Login Redirect"]//following::div[2]');
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
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

  it('User can modify API and select multiple Grant types', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OAUTH_PASSWORD_BOX.click();
    apis_page.OAS_OAUTH_REFRESH_TOKEN_BOX.click();
    apis_page.OAS_OAUTH_AUTH_HEADER_INPUT.setValue('new-auth');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_OAUTH_USE_COOKIE_BOX.click();
    apis_page.OAS_OAUTH_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_OAUTH_COOKIE_VALUE_INPUT.setValue('my-cookie');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated data is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const cookieValueSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
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
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
  }

});