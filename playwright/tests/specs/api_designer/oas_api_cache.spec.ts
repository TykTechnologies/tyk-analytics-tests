import { test, assert } from '@fixtures';

test('Test CACHE settings on OAS API designer page', async ({ createUserAndLogin, main_page, apis_page, page }) => {
  test.setTimeout(190000);
  const firstAPI = false;

  await test.step('CACHE settings is off by default', async () => {
    const firstAPI = true;
    await openOasDesignerPage(firstAPI);
    assert(await apis_page.OAS_ENABLE_CACHE_TOGGLE.isSelected()).toBeFalsy();
  });

  await test.step('User can change Cache Timeout and save API', async () => {
    const firstAPI = true;
    const apiName = 'cache-timeout';
    await openOasDesignerPage(firstAPI);
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    await apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    await apis_page.OAS_CACHE_TIMEOUT_INPUT.fill("44");
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Cache Timeout is persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    await assert(apis_page.OAS_CACHE_TIMEOUT_SAVED).toHaveText("44");
  });

  await test.step('User can set Cache Response Codes and save API', async () => {
    const apiName = 'cache-response-codes';
    await openOasDesignerPage(firstAPI);
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    await apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.selectOptions(["200 OK", "403 Forbidden"]); //direct select
    await apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("410"); //input and match from dropdown
    await apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN.setValue("299"); //free input custom value
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Cache Response Codes are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_RESPONSE_CODES_SAVED).toHaveText("200 OK, 403 Forbidden, 410 Gone, 299");
  });

  await test.step('Cache Response Codes are properly displayed in API Edit mode', async () => {
    await apis_page.EDIT_BUTTON.click();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_RESPONSE_CODES_DROPDOWN).toHaveText("200 OK403 Forbidden410 Gone299");
  });

  await test.step('User can set Cache All Safe Requests and save API', async () => {
    const apiName = 'cache-all-safe-requests';
    await openOasDesignerPage(firstAPI);
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    await apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX.click();
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Cache All Safe Requests is persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_CACHE_ALL_SAVE_REQUEST_BOX).toBeChecked();
  });

  await test.step('User can set Cache by Headers and save API', async () => {
    const apiName = 'cache-by-headers';
    await openOasDesignerPage(firstAPI);
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    await apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX.click();
    await apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-1");
    await apis_page.OAS_CACHE_BY_HEADERS_DROPDOWN.setValue("header-2");
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Cache by Headers are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_UPSTREAM_CACHE_CONTROL_BOX).toBeChecked();
    await apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await assert(apis_page.OAS_CACHE_BY_HEADERS_SAVED).toHaveText("header-1, header-2");
  });

  await test.step('User can set Cache Control TTL Header and save API', async () => {
    const apiName = 'cache-ttl-header';
    await openOasDesignerPage(firstAPI);
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ENABLE_CACHE_TOGGLE.click();
    await apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await apis_page.OAS_CACHE_CONTROL_TTL_HEADER_INPUT.fill("header-ttl");
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Cache Control TTL Header is persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await apis_page.OAS_ADVANCED_OPTIONS_ACCORDION.expand();
    await assert(apis_page.OAS_CACHE_CONTROL_TTL_HEADER_SAVED).toHaveText("header-ttl");
  });

  async function openOasDesignerPage(firstApi: boolean) {
    await main_page.openAPIs();
    firstApi ? await apis_page.DESIGN_API_BOX.click() : await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_TYPE_OAS_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill('cache-test');
    await apis_page.OAS_NEXT_BUTTON.click();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  async function createApi(apiName: string) {
    await apis_page.SIDE_MENU_BASE_LINK.click();
    await apis_page.API_NAME_INPUT.waitFor();
    await apis_page.API_NAME_INPUT.fill(apiName);
    await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    await apis_page.OAS_SAVE_BUTTON.click();
  }

});
