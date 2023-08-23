import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

test('Test multi auth in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  let firstAPI = false;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User can set multi authentication', async () => {
    let firstAPI = true;
    openOasDesignerPage(firstAPI);
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Multiple Authentication Mechanisms");
    await assert(apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN).toBeDisplayed();
    await assert(apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN).toBeDisplayed();

  });

  await test.step('Base Identity provide is mandatory', async () => {
   await apis_page.OAS_SAVE_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    let baseIdProviderErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.baseIdentityProvider"]//following::p[1]');
    await assert(baseIdProviderErrorMsg).toHaveText('Base athentication method needs to be selected');
  });

  await test.step('User can set multi-auth with Base Identity Provider and Save API', async () => {
    apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN.selectOptions(["Auth Token", "JSON Web Token (JWT)"]);
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN.selectOption("Auth Token");
   await apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.fill("authToken");
   await apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX.click();
   await apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT.fill("auth-header");
   await apis_page.OAS_JWT_CONFIG_NAME.fill("jwtAuth");
   await apis_page.OAS_JWT_SIGNING_METHOD_DROPDOWN.selectOption("HMAC");
   await apis_page.OAS_JWT_IDENTITY_SOURCE_INPUT.fill("sub");
   await apis_page.OAS_JWT_POLICY_FIELD_INPUT.fill("pol");
   await apis_page.OAS_JWT_USE_HEADER_BOX.click();
   await apis_page.OAS_JWT_HEADER_NAME_INPUT.fill("jwt-header");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Multi-auth data is saved correclty and displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("Multiple Authentication Mechanisms");
    await assert(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("Auth Token, JSON Web Token (JWT)");
    await assert(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("Auth Token");
  });

  await test.step('User can modify Base Identity Provider and Update API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN.selectOption("JSON Web Token (JWT)");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Base Identity Provider is displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("Multiple Authentication Mechanisms");
    await assert(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("Auth Token, JSON Web Token (JWT)");
    await assert(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("JSON Web Token (JWT)");
  });

  await test.step('User can modify Chosen Autentication Types and Update API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN.selectOption("Auth Token");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Chosen Autentication Types is displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("JSON Web Token (JWT)");
    //TODO Currenlty we only have 2 auth methods. This test needs to be updated when we have more
    //await assert(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("JSON Web Token (JWT)");
    //await assert(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("JSON Web Token (JWT)");
  });

  function openOasDesignerPage(firstApi) {
    await main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.OAS_ADD_API_BUTTON.click();;
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('auth-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
  }

});