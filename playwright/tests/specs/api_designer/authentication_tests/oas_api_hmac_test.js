import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';

test('Test HMAC Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Test HMAC auth default settings', async () => {
    main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('hmac-auth-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("HMAC (Signed Authentication Key");
    wdioExpect(apis_page.OAS_HMAC_ENABLE_CLOCK_SKEW_BOX).not.toBeChecked();
    let basicAuthUrl = $('a*=Learn more about HMAC (Signed Authentication Key');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/hmac-signatures/');
  });

  await test.step('Test HMAC mandatory fields', async () => {
   await apis_page.OAS_SAVE_BUTTON.click();
    let authTokenLocationErrorMsg = $('//h4[text()="Authentication token location"]//following::p[1]');
    wdioExpect(authTokenLocationErrorMsg).toHaveText('Select at least one location where the token will be read of');
  });

  await test.step('User can save API with HMAC settings', async () => {
   await apis_page.OAS_HMAC_USE_AUTH_BOX.click();
   await apis_page.OAS_HMAC_USE_COOKIE_BOX.click();
   await apis_page.OAS_HMAC_COOKIE_VALUE_INPUT.fill('my-cookie');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  await test.step('HMAC data is displayed after page reload', async () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const allowedAlgorithmsSaved = $('//label[text()="Allowed Algorithms"]//following::div[1]');
    const cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('HMAC (Signed Authentication Key)');
    wdioExpect(allowedAlgorithmsSaved).toHaveText('-');
    wdioExpect(apis_page.OAS_HMAC_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization');
    wdioExpect(cookieNameSaved).toHaveText('my-cookie');
  });

  await test.step('User can modify HMAC data and Update API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_HMAC_ALLOWED_ALGORITHMS_DROPDOWN.selectOptions(['sha1', 'sha512']);
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_HMAC_ENABLE_CLOCK_SKEW_BOX.click();
   await apis_page.OAS_HMAC_CLOCK_SKEW_INPUT.fill('44');
   await apis_page.OAS_HMAC_AUTH_HEADER_INPUT.fill('new-auth');
   await apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
   await apis_page.OAS_HMAC_USE_COOKIE_BOX.click();
   await apis_page.OAS_HMAC_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_HMAC_QUERY_PARAM_INPUT.fill('new-param');
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Updated HMAC data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const allowedAlgorithmsSaved = $('//label[text()="Allowed Algorithms"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(allowedAlgorithmsSaved).toHaveText('sha1, sha512');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('new-auth');
    wdioExpect(apis_page.OAS_HMAC_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_HMAC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(queryParamNameSaved).toHaveText('new-param');
  });

});