import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';

import { expect } from 'chai';

test('Test CACHE settings on OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  
  let firstAPI = false;

  
  await test.step('CACHE settings is off by default', async () => {
    let firstAPI = true;
    openOasDesignerPage(firstAPI);
    assert(await apis_page.OAS_ENABLE_CACHE_TOGGLE.isSelected()).toBeFalsy();
  });

  await test.step('User can change Cache Timeout and save API', async () => {
    let firstAPI = true;
    let apiName = 'cache-timeout';
    openOasDesignerPage(firstAPI);
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
   await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
   await apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
   await apis_page.OAS_CACHE_TIMEOUT_INPUT.fill("44");
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Cache Timeout is persistent after reloading the page', async () => {
    page.reload();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    await assert(apis_page.OAS_CACHE_TIMEOUT_SAVED).toHaveText("44");
  });

  await test.step('User can set Cache Response Codes and save API', async () => {
    let apiName = 'cache-response-codes';
    openOasDesignerPage(firstAPI);
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
   await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.selectOptions(["200 OK", "403 Forbidden"]); //direct select
   await apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.fill("410"); //input and match from dropdown
   await apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.fill("299"); //free input custom value
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Cache Response Codes are persistent after reloading the page', async () => {
    page.reload();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_RESPONSE_CODES_SAVED).toHaveText("200 OK, 403 Forbidden, 410 Gone, 299");
  });

  await test.step('Cache Response Codes are properly displayed in API Edit mode', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).toHaveText("200 OK\n403 Forbidden\n410 Gone\n299");
  });

  await test.step('User can set Cache All Safe Requests and save API', async () => {
    let apiName = 'cache-all-safe-requests';
    openOasDesignerPage(firstAPI);
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
   await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
   await apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX.click();
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Cache All Safe Requests is persistent after reloading the page', async () => {
    page.reload();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX).toBeChecked();
  });
  
  await test.step('User can set Cache by Headers and save API', async () => {
    let apiName = 'cache-by-headers';
    openOasDesignerPage(firstAPI);
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
   await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
   await apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
   await apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.fill("header-1");
   await apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.fill("header-2");
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Cache by Headers are persistent after reloading the page', async () => {
    page.reload();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await assert(apis_page.OAS_CACHE_BY_HEADERS_SAVED).toHaveText("header-1, header-2");
  });

  await test.step('User can set Cache Control TTL Header and save API', async () => {
    let apiName = 'cache-ttl-header';
    openOasDesignerPage(firstAPI);
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
   await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
   await apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT.fill("header-ttl");
    createApi(apiName);
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Cache Control TTL Header is persistent after reloading the page', async () => {
    page.reload();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await assert(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_SAVED).toHaveText("header-ttl");
  });

  function openOasDesignerPage(firstApi) {
    await main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('cache-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
   await apis_page.SIDE_MENU_BASE_LINK.click();
  await apis_page.API_NAME_INPUT.waitFor();
   await apis_page.API_NAME_INPUT.fill(apiName);
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_SAVE_BUTTON.click();
  }

});
