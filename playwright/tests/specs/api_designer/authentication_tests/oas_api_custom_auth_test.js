import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';
import { regex } from 'uuidv4';

test('Test Custom Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  const customPluginDetails = {
    authType: "Custom Plugin",
    url1: "https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/go-plugin-authentication/",
    url2: "https://tyk.io/docs/plugins/supported-languages/rich-plugins/python/custom-auth-python-tutorial/",
    authHeader: "custom-header",
    paramName: "custom-param",
    cookieName: "custom-cookie",
    authHeaderUpdated: "custom-header-updated",
    paramNameUpdated: "custom-param-updated",
    cookieNameUpdated: "custom-cookie-updated",
    functionName: "myPluginTest",
    path: "/opt/tyk-gateway/plugins/myPlugin.so",
    functionNameUpdated: "myPluginTestUpdated",
    pathUpdated: "/opt/tyk-gateway/plugins/myPluginUpdated.so",
    formParamName: "formParamName",
    formParamNameUpdated: "formParamNameUpdated",
    regex: "\d{5}(-\d{4})?",
    regexIndex: "1",
    regexUpdated: "rege(x(es)?|xps?)",
    regexIndexUpdated: "2",
    xpath: "/bookstore/book/price[text()]",
    xpathUpdated: "//tagname[@Attribute='Value']"
  };

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User can create API with Custom Plugin authentication', async () => {
    await main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('custom-auth-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption(customPluginDetails.authType);
    let goAuthUrl = $('a*=Learn more about custom Go plugin');
    let pythonAuthUrl = $('a*=Learn more about custom Python plugin');
    await assert(goAuthUrl).toHaveLink(customPluginDetails.url1);
    await assert(pythonAuthUrl).toHaveLink(customPluginDetails.url2);
    await assert(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toBeVisible();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Custom Plugin authentication is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText(customPluginDetails.authType);
  });

  await test.step('User can enable Plugin Config', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    let functionNameErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.functionName"]//following::p[1]');
    let pathErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.path"]//following::p[1]');
    await assert(functionNameErrorMsg).toHaveText('Function name is required');
    await assert(pathErrorMsg).toHaveText('Path is required');
   await apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.fill(customPluginDetails.functionName);
   await apis_page.OAS_CUSTOM_PATH_INPUT.fill(customPluginDetails.path);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Plugin Config is displayed after page reload', async () => {
    browser.refresh();
    let functionNameSaved = $('//span[text()="Function Name"]//following::div[2]');
    let pathSaved = $('//span[text()="Path"]//following::div[2]');
    await assert(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).toBeChecked();
    await assert(functionNameSaved).toHaveText(customPluginDetails.functionName);
    await assert(pathSaved).toHaveText(customPluginDetails.path);
  });

  await test.step('User can modify Plugin Config', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.fill(customPluginDetails.functionNameUpdated);
   await apis_page.OAS_CUSTOM_PATH_INPUT.fill(customPluginDetails.pathUpdated);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Mofidied Plugin Config is displayed after page reload', async () => {
    browser.refresh();
    let functionNameSaved = $('//span[text()="Function Name"]//following::div[2]');
    let pathSaved = $('//span[text()="Path"]//following::div[2]');
    await assert(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).toBeChecked();
    await assert(functionNameSaved).toHaveText(customPluginDetails.functionNameUpdated);
    await assert(pathSaved).toHaveText(customPluginDetails.pathUpdated);
  });

  await test.step('User can disable Plugin Config', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Plugin Config is not displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).not.toBeChecked();
  });

  await test.step('User can add Auth Token Location', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX.click();
   await apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.fill(customPluginDetails.authHeader);
   await apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
   await apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.fill(customPluginDetails.cookieName);
   await apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.fill(customPluginDetails.paramName);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Auth Token Location is displayed after page reload', async () => {
    browser.refresh();
    let authKeyHeaderNameSaved = $('//label[text()="Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    await assert(apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX).toBeChecked();
    await assert(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).toBeChecked();
    await assert(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    await assert(authKeyHeaderNameSaved).toHaveText(customPluginDetails.authHeader);
    await assert(queryParamNameSaved).toHaveText(customPluginDetails.paramName);
    await assert(cookieNameSaved).toHaveText(customPluginDetails.cookieName);
  });

  await test.step('User can modify Auth Token Location', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.fill(customPluginDetails.authHeaderUpdated);
   await apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.fill(customPluginDetails.cookieNameUpdated);
   await apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.fill(customPluginDetails.paramNameUpdated);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Modified Auth Token Location is displayed after page reload', async () => {
    browser.refresh();
    let authKeyHeaderNameSaved = $('//label[text()="Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    await assert(authKeyHeaderNameSaved).toHaveText(customPluginDetails.authHeaderUpdated);
    await assert(queryParamNameSaved).toHaveText(customPluginDetails.paramNameUpdated);
    await assert(cookieNameSaved).toHaveText(customPluginDetails.cookieNameUpdated);
  });

  await test.step('User can disable Auth Token Location', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX.click();
   await apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
   await apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Auth Token Location is not displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX).not.toBeChecked();
    await assert(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).not.toBeChecked();
    await assert(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).not.toBeChecked();
  });
  
  await test.step('User can enable Raw Body and Require Session', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
   await apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.fill(customPluginDetails.functionName);
   await apis_page.OAS_CUSTOM_PATH_INPUT.fill(customPluginDetails.path);
   await apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE.click();
   await apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Raw Body and Require Session is displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE).toBeChecked();
    //await assert(apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE).toBeChecked();
  });

  await test.step('User can disable Raw Body and Require Session', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE.click();
   await apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Raw Body and Require Session is not displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE).not.toBeChecked();
    await assert(apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE).not.toBeChecked();
  });

  await test.step('User can enable ID Extractor - Header with Value', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE.click();
   await apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Header');
   await apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Value');
   await apis_page.OAS_CUSTOM_HEADER_NAME_INPUT.fill(customPluginDetails.authHeader);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Header with Value data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let headerNameSaved = $('//span[text()="Header Name"]//following::div[2]');
    await assert(extractFromSaved).toHaveText('Header');
    await assert(extractWithSaved).toHaveText('Value');
    await assert(headerNameSaved).toHaveText(customPluginDetails.authHeader);
  });

  await test.step('User can modify ID Extractor Header Name', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_HEADER_NAME_INPUT.fill(customPluginDetails.authHeaderUpdated);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Modified Header Name data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let headerNameSaved = $('//span[text()="Header Name"]//following::div[2]');
    await assert(headerNameSaved).toHaveText(customPluginDetails.authHeaderUpdated);
  });

  await test.step('User can enable ID Extractor - Form with Regex', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Form');
   await apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Regex');
   await apis_page.OAS_CUSTOM_FORM_PARTAM_NAME_INPUT.fill(customPluginDetails.formParamName);
   await apis_page.OAS_CUSTOM_REGEXP_INPUT.fill(customPluginDetails.regex);
   await apis_page.OAS_CUSTOM_REGEXP_INDEX_INPUT.fill(customPluginDetails.regexIndex);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Form with Regex data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let paramNameSaved = $('//span[text()="Form Param Name"]//following::div[2]');
    let regexSaved = $('//span[text()="Regexp"]//following::div[2]');
    let regexIndexSaved = $('//span[text()="Regexp Match Index"]//following::div[2]');
    await assert(extractFromSaved).toHaveText('Form');
    await assert(extractWithSaved).toHaveText('Regex');
    await assert(paramNameSaved).toHaveText(customPluginDetails.formParamName);
    await assert(regexSaved).toHaveText(customPluginDetails.regex);
    await assert(regexIndexSaved).toHaveText(customPluginDetails.regexIndex);
  });

  await test.step('User can modify ID Extractor Form name and Regex', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_FORM_PARTAM_NAME_INPUT.fill(customPluginDetails.formParamNameUpdated);
   await apis_page.OAS_CUSTOM_REGEXP_INPUT.fill(customPluginDetails.regexUpdated);
   await apis_page.OAS_CUSTOM_REGEXP_INDEX_INPUT.fill(customPluginDetails.regexIndexUpdated);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Modified Form name and Regex data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let paramNameSaved = $('//span[text()="Form Param Name"]//following::div[2]');
    let regexSaved = $('//span[text()="Regexp"]//following::div[2]');
    let regexIndexSaved = $('//span[text()="Regexp Match Index"]//following::div[2]');
    await assert(paramNameSaved).toHaveText(customPluginDetails.formParamNameUpdated);
    await assert(regexSaved).toHaveText(customPluginDetails.regexUpdated);
    await assert(regexIndexSaved).toHaveText(customPluginDetails.regexIndexUpdated);
  });

  await test.step('User can enable ID Extractor - Body with Xpath', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Body');
   await apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Xpath');
   await apis_page.OAS_CUSTOM_XPATH_INPUT.fill(customPluginDetails.xpath);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Body with Xpath data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let xpathNameSaved = $('//span[text()="XPath expression"]//following::div[2]');
    await assert(extractFromSaved).toHaveText('Body');
    await assert(extractWithSaved).toHaveText('Xpath');
    await assert(xpathNameSaved).toHaveText(customPluginDetails.xpath);
  });

  await test.step('User can modify ID Extractor Xpath expression', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_XPATH_INPUT.fill(customPluginDetails.xpathUpdated);
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Modified Xpath expression is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let xpathNameSaved = $('//span[text()="XPath expression"]//following::div[2]');
    await assert(xpathNameSaved).toHaveText(customPluginDetails.xpathUpdated);
  });

  await test.step('User can disable ID Extractor', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Header with Value data is displayed after page reload', async () => {
    browser.refresh();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    await assert(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).not.toBeChecked();
  });

});
