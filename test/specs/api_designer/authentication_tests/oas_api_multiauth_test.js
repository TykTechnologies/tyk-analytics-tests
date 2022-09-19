import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

describe('Test multi auth in OAS API designer page', () => {
  let envDetails;
  let firstAPI = false;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User can set multi authentication', () => {
    let firstAPI = true;
    openOasDesignerPage(firstAPI);
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Multiple Authentication Mechanisms");
    wdioExpect(apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN).toBeDisplayed();
    wdioExpect(apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN).toBeDisplayed();

  });

  it('Base Identity provide is mandatory', () => {
    apis_page.OAS_SAVE_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    let baseIdProviderErrorMsg = $('//div[@name="x-tyk-api-gateway.server.authentication.baseIdentityProvider"]//following::p[1]');
    wdioExpect(baseIdProviderErrorMsg).toHaveText('Base athentication method needs to be selected');
  });

  it('User can set multi-auth with Base Identity Provider and Save API', () => {
    apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN.selectOptions(["Auth Token", "JSON Web Token (JWT)"]);
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN.selectOption("Auth Token");
    apis_page.OAS_AUTH_TOKEN_CONFIG_NAME.setValue("authToken");
    apis_page.OAS_AUTH_TOKEN_USE_HEADER_BOX.click();
    apis_page.OAS_AUTH_TOKEN_HEADER_NAME_INPUT.setValue("auth-header");
    apis_page.OAS_JWT_CONFIG_NAME.setValue("jwtAuth");
    apis_page.OAS_JWT_SIGNING_METHOD_DROPDOWN.selectOption("HMAC");
    apis_page.OAS_JWT_IDENTITY_SOURCE_INPUT.setValue("sub");
    apis_page.OAS_JWT_POLICY_FIELD_INPUT.setValue("pol");
    apis_page.OAS_JWT_USE_HEADER_BOX.click();
    apis_page.OAS_JWT_HEADER_NAME_INPUT.setValue("jwt-header");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Multi-auth data is saved correclty and displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("Multiple Authentication Mechanisms");
    wdioExpect(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("Auth Token, JSON Web Token (JWT)");
    wdioExpect(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("Auth Token");
  });

  it('User can modify Base Identity Provider and Update API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_BASE_IDENTITY_PROVIDER_DROPDOWN.selectOption("JSON Web Token (JWT)");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Base Identity Provider is displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("Multiple Authentication Mechanisms");
    wdioExpect(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("Auth Token, JSON Web Token (JWT)");
    wdioExpect(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("JSON Web Token (JWT)");
  });

  it('User can modify Chosen Autentication Types and Update API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CHOSEN_AUTH_TYPES_DROPDOWN.selectOption("Auth Token");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Chosen Autentication Types is displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText("JSON Web Token (JWT)");
    //TODO Currenlty we only have 2 auth methods. This test needs to be updated when we have more
    //wdioExpect(apis_page.OAS_CHOSEN_AUTH_TYPES_SAVED).toHaveText("JSON Web Token (JWT)");
    //wdioExpect(apis_page.OAS_BASE_IDENTITY_PROVIDER_SAVED).toHaveText("JSON Web Token (JWT)");
  });

  function openOasDesignerPage(firstApi) {
    main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.OAS_ADD_API_BUTTON.click();;
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
  }

});