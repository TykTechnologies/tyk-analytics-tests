import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';

import { expect } from 'chai';

test('Test CORS settings on OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  let enableCors = true;
  let firstApi = false;
  let originValue = 'https://*.domain.com';
  let headerValue = 'my-custom-header';

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('CORS default state is disabled', async () => {
    let enableCors = false;
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    assert(apis_page.OAS_ENABLE_CORS_TOGGLE.isSelected()).toBeFalsy();
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeDisplayed();
  });

  await test.step('User can enable CORS and see default CORS values', async () => {
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeChecked();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeChecked();
    await assert(apis_page.OAS_DEBUG_BOX).not.toBeChecked();
    await assert(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).toBeChecked();
    await assert(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeChecked();
    await assert(apis_page.OAS_MAX_AGE_INPUT).toHaveValue("24");
    await assert(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).toHaveText("GET\nHEAD\nPOST");
    await assert(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).toHaveText("Allow all Origins");
    await assert(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).toHaveText("Accept\nContent-Type\nOrigin\nX-Requested-With\nAuthorization");
    await assert(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).toHaveText("");
  });

  await test.step('User can save API with default CORS values', async () => {
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    let apiName = "defaults defaults everywhere";
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should not see CORS settings if Enable Options Pass Through is checked', async () => {  
    openOasDesignerPage(firstApi, enableCors);
   await apis_page.OAS_OPTIONS_PASS_THROUGH_BOX.click();
    corsOptionPassThruHidesOtherElements();
  });

  await test.step('User can save API with enabled Enable Options Pass Through', async () => {
    let apiName = "option-pass-through";
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Options Pass Through is persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeChecked();
    corsOptionPassThruHidesOtherElements();
  });

  await test.step('User can change Allowed Methods and save API', async () => {
    let apiName = 'allowed-methods';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOWED_METHODS_DROPDOWN.selectOptions(["HEAD", "POST", "PATCH", "DELETE"]);
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Allowed Methods are persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_METHODS_SAVED).toHaveText("GET, PATCH, DELETE");
  });

  await test.step('User can change Allow Credentials, Debug, Max Age and save API', async () => {
    let apiName = 'Hey you out there on your own';
    openOasDesignerPage(firstApi, enableCors);
   await apis_page.OAS_ALLOW_CREDENTIALS_BOX.click();
   await apis_page.OAS_DEBUG_BOX.click();
   await apis_page.OAS_MAX_AGE_INPUT.fill("34");
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Data are persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).toBeChecked();
    await assert(apis_page.OAS_DEBUG_BOX).toBeChecked();
    await assert(apis_page.OAS_MAX_AGE_SAVED).toHaveText("34");
  });

  await test.step('User can enter Allowed Origins and save API', async () => {
    let apiName = 'allowed-origins';
    openOasDesignerPage(firstApi, enableCors);
   await apis_page.OAS_ALLOW_ALL_ORIGINS_BOX.click();
   await apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN.fill(originValue);
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Allowed Origins are persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_ORIGINS_SAVED).toHaveText(originValue);
  });

  await test.step('User can slect Allowed Headers or enter his own value and save API', async () => {
    let apiName = 'allowed-headers';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.selectOptions(["Accept", "Origin"]);
   await apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.fill(headerValue);
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Allowed Headers are persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_HEADERS_SAVED).toHaveText("Content-Type, X-Requested-With, Authorization, " + headerValue);
  });

  await test.step('User can input Exposed Headers and save API', async () => {
    let apiName = 'exposed-headers';
    openOasDesignerPage(firstApi, enableCors);
   await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.fill("value-1-header");
   await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.fill("value-2");
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Exposed Headers are persistent after reloading the page', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_EXPOSED_HEADERS_SAVED).toHaveText("value-1-header, value-2");
  });

  function openOasDesignerPage(firstApi, enableCors) {
    await main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('cors-test');
   await apis_page.OAS_NEXT_BUTTON.click();
    enableCors ? apis_page.OAS_ENABLE_CORS_TOGGLE.click() : null;
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
   await apis_page.SIDE_MENU_BASE_LINK.click();
  await apis_page.API_NAME_INPUT.waitFor();
   await apis_page.API_NAME_INPUT.fill(apiName);
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_TARGET_URL_INPUT.fill("http://httpbin.org");
   await apis_page.OAS_SAVE_BUTTON.click();
  }

  function corsOptionPassThruHidesOtherElements() {
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeDisplayed();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeDisplayed();
    await assert(apis_page.OAS_DEBUG_BOX).not.toBeDisplayed();
    await assert(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).not.toBeDisplayed();
    await assert(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeDisplayed();
    await assert(apis_page.OAS_MAX_AGE_INPUT).not.toBeDisplayed();
    await assert(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).not.toBeDisplayed();
    await assert(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).not.toBeDisplayed();
    await assert(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).not.toBeDisplayed();
    await assert(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).not.toBeDisplayed();
  }

});
