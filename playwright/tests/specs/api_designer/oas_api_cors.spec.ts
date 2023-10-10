import { test, assert } from '@fixtures';

test('Test CORS settings on OAS API designer page', async ({ createUserAndLogin, main_page, apis_page, page }) => {
  test.setTimeout(2500000);
  const enableCors = true;
  const firstApi = false;
  const originValue = 'https://*.domain.com';
  const headerValue = 'my-custom-header';


  await test.step('CORS default state is disabled', async () => {
    const enableCors = false;
    const firstApi = true;
    await openOasDesignerPage(firstApi, enableCors);
    assert(await apis_page.OAS_ENABLE_CORS_TOGGLE.isSelected()).toBeFalsy();
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeVisible();
  });

  await test.step('User can enable CORS and see default CORS values', async () => {
    const firstApi = true;
    await openOasDesignerPage(firstApi, enableCors);
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeChecked();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeChecked();
    await assert(apis_page.OAS_DEBUG_BOX).not.toBeChecked();
    await assert(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).toBeChecked();
    await assert(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeChecked();
    await assert(apis_page.OAS_MAX_AGE_INPUT).toHaveValue("24");
    await assert(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).toHaveText("GETHEADPOST");
    await assert(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).toHaveText("Allow all Origins");
    await assert(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).toHaveText("AcceptContent-TypeOriginX-Requested-WithAuthorization");
    await assert(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).toHaveText("");
  });

  await test.step('User can save API with default CORS values', async () => {
    const firstApi = true;
    await openOasDesignerPage(firstApi, enableCors);
    const apiName = "defaults defaults everywhere";
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('User should not see CORS settings if Enable Options Pass Through is checked', async () => {
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_OPTIONS_PASS_THROUGH_BOX.click();
    await corsOptionPassThruHidesOtherElements();
  });

  await test.step('User can save API with enabled Enable Options Pass Through', async () => {
    const apiName = "option-pass-through";
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Options Pass Through is persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeChecked();
    await corsOptionPassThruHidesOtherElements();
  });

  await test.step('User can change Allowed Methods and save API', async () => {
    const apiName = 'allowed-methods';
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.scrollIntoView();
    // await apis_page.OAS_ALLOWED_METHODS_DROPDOWN.selectOptions(["HEAD", "POST", "PATCH", "DELETE"]);
    await selectAllowedMethods(["HEAD", "POST", "PATCH", "DELETE"]);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Allowed Methods are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_METHODS_SAVED).toHaveText("GET, PATCH, DELETE");
  });

  await test.step('User can change Allow Credentials, Debug, Max Age and save API', async () => {
    const apiName = 'Hey you out there on your own';
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_ALLOW_CREDENTIALS_BOX.click();
    await apis_page.OAS_DEBUG_BOX.click();
    await apis_page.OAS_MAX_AGE_INPUT.fill("34");
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Data are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).toBeChecked();
    await assert(apis_page.OAS_DEBUG_BOX).toBeChecked();
    await assert(apis_page.OAS_MAX_AGE_SAVED).toHaveText("34");
  });

  await test.step('User can enter Allowed Origins and save API', async () => {
    const apiName = 'allowed-origins';
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_ALLOW_ALL_ORIGINS_BOX.click();
    await apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN.setValue(originValue);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Allowed Origins are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_ORIGINS_SAVED).toHaveText(originValue);
  });

  await test.step('User can slect Allowed Headers or enter his own value and save API', async () => {
    const apiName = 'allowed-headers';
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.scrollIntoView();
    await apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.selectOptions(["Accept", "Origin"]);
    await apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.setValue(headerValue);
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Allowed Headers are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_ALLOWED_HEADERS_SAVED).toHaveText("Content-Type, X-Requested-With, Authorization, " + headerValue);
  });

  await test.step('User can input Exposed Headers and save API', async () => {
    const apiName = 'exposed-headers';
    await openOasDesignerPage(firstApi, enableCors);
    await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.setValue("value-1-header");
    await apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.setValue("value-2");
    await createApi(apiName);
    await apis_page.isApiCreatedPopUpDisplayed();
  });

  await test.step('Exposed Headers are persistent after reloading the page', async () => {
    await page.reload();
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    await assert(apis_page.OAS_EXPOSED_HEADERS_SAVED).toHaveText("value-1-header, value-2");
  });

  async function openOasDesignerPage(firstApi: boolean, enableCors: boolean) {
    await main_page.openAPIs();
    firstApi ? await apis_page.DESIGN_API_BOX.click() : await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_TYPE_OAS_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill('cors-test');
    await apis_page.OAS_NEXT_BUTTON.click();
    if (enableCors) {
      await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
      await apis_page.OAS_ENABLE_CORS_TOGGLE.click();
    }
    await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  async function selectAllowedMethods(methods: string[]) {
    for (const method of methods) {
      await apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
      await apis_page.OAS_ALLOWED_METHODS_DROPDOWN.selectOption(method);
    }
  }

  async function createApi(apiName: string) {
    await apis_page.SIDE_MENU_BASE_LINK.click();
    await apis_page.API_NAME_INPUT.waitFor();
    await apis_page.API_NAME_INPUT.fill(apiName);
    await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    await apis_page.OAS_TARGET_URL_INPUT.fill("http://httpbin.org");
    await apis_page.OAS_SAVE_BUTTON.click();
  }

  async function corsOptionPassThruHidesOtherElements() {
    await assert(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeVisible();
    await assert(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeVisible();
    await assert(apis_page.OAS_DEBUG_BOX).not.toBeVisible();
    await assert(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).not.toBeVisible();
    await assert(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeVisible();
    await assert(apis_page.OAS_MAX_AGE_INPUT).not.toBeVisible();
    await assert(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).not.toBeVisible();
    await assert(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).not.toBeVisible();
    await assert(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).not.toBeVisible();
    await assert(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).not.toBeVisible();
  }

});
