import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../../config_variables';
import { expect } from 'chai';

xdescribe('Test HMAC Authentication in OAS API designer page', () => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test HMAC auth default settings', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH);//TO BE REMOVED WHEN RELEASED
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_NAME_INPUT.setValue('hmac-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("HMAC (Signed Authentication Key");
    wdioExpect(apis_page.OAS_HMAC_ENABLE_CLOCK_SKEW_BOX).not.toBeChecked();
    let basicAuthUrl = $('a*=Learn more about HMAC (Signed Authentication Key');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/hmac-signatures/');
  });

  it('Test HMAC mandatory fields', () => {
    apis_page.OAS_SAVE_BUTTON.click();
    let authKeyHeaderErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.hmac.header.name"]//following::p[1]');
    wdioExpect(authKeyHeaderErrorMsg).toHaveText('Auth Key Header Name is required');
  });

  it('User can save API with HMAC settings', () => {
    apis_page.OAS_HMAC_AUTH_HEADER_INPUT.setValue('Authorization');
    apis_page.OAS_HMAC_USE_COOKIE_BOX.click();
    apis_page.OAS_HMAC_COOKIE_VALUE_INPUT.setValue('my-cookie');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('HMAC data is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const allowedAlgorithmsSaved = $('//label[text()="Allowed Algorithms"]//following::div[1]');
    const cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('HMAC (Signed Authentication Key)');
    wdioExpect(allowedAlgorithmsSaved).toHaveText('-');
    wdioExpect(apis_page.OAS_HMAC_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization');
    wdioExpect(cookieNameSaved).toHaveText('my-cookie');
  });

  it('User can modify HMAC data and Update API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_HMAC_ALLOWED_ALGORITHMS_DROPDOWN.selectOptions(['sha1', 'sha512']);
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_HMAC_ENABLE_CLOCK_SKEW_BOX.click();
    apis_page.OAS_HMAC_CLOCK_SKEW_INPUT.setValue('44');
    apis_page.OAS_HMAC_AUTH_HEADER_INPUT.setValue('new-auth');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_HMAC_USE_COOKIE_BOX.click();
    apis_page.OAS_HMAC_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_HMAC_QUERY_PARAM_INPUT.setValue('new-param');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated HMAC data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const allowedAlgorithmsSaved = $('//label[text()="Allowed Algorithms"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(allowedAlgorithmsSaved).toHaveText('sha1, sha512');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('new-auth');
    wdioExpect(apis_page.OAS_HMAC_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_HMAC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(queryParamNameSaved).toHaveText('new-param');
  });

});