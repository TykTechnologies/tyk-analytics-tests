import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';
import { regex } from 'uuidv4';

describe('Test Custom Authentication in OAS API designer page', () => {
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

  it('User can create API with Custom Plugin authentication', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('custom-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption(customPluginDetails.authType);
    let goAuthUrl = $('a*=Learn more about custom Go plugin');
    let pythonAuthUrl = $('a*=Learn more about custom Python plugin');
    wdioExpect(goAuthUrl).toHaveLink(customPluginDetails.url1);
    wdioExpect(pythonAuthUrl).toHaveLink(customPluginDetails.url2);
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toExist();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Custom Plugin authentication is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText(customPluginDetails.authType);
  });

  it('User can enable Plugin Config', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
    apis_page.OAS_SAVE_BUTTON.click();
    let functionNameErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.functionName"]//following::p[1]');
    let pathErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.path"]//following::p[1]');
    wdioExpect(functionNameErrorMsg).toHaveText('Function name is required');
    wdioExpect(pathErrorMsg).toHaveText('Path is required');
    apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.setValue(customPluginDetails.functionName);
    apis_page.OAS_CUSTOM_PATH_INPUT.setValue(customPluginDetails.path);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Plugin Config is displayed after page reload', () => {
    browser.refresh();
    let functionNameSaved = $('//span[text()="Function Name"]//following::div[2]');
    let pathSaved = $('//span[text()="Path"]//following::div[2]');
    wdioExpect(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).toBeChecked();
    wdioExpect(functionNameSaved).toHaveText(customPluginDetails.functionName);
    wdioExpect(pathSaved).toHaveText(customPluginDetails.path);
  });

  it('User can modify Plugin Config', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.setValue(customPluginDetails.functionNameUpdated);
    apis_page.OAS_CUSTOM_PATH_INPUT.setValue(customPluginDetails.pathUpdated);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Mofidied Plugin Config is displayed after page reload', () => {
    browser.refresh();
    let functionNameSaved = $('//span[text()="Function Name"]//following::div[2]');
    let pathSaved = $('//span[text()="Path"]//following::div[2]');
    wdioExpect(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).toBeChecked();
    wdioExpect(functionNameSaved).toHaveText(customPluginDetails.functionNameUpdated);
    wdioExpect(pathSaved).toHaveText(customPluginDetails.pathUpdated);
  });

  it('User can disable Plugin Config', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Plugin Config is not displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE).not.toBeChecked();
  });

  it('User can add Auth Token Location', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue(customPluginDetails.authHeader);
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.setValue(customPluginDetails.cookieName);
    apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue(customPluginDetails.paramName);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Auth Token Location is displayed after page reload', () => {
    browser.refresh();
    let authKeyHeaderNameSaved = $('//label[text()="Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    wdioExpect(apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText(customPluginDetails.authHeader);
    wdioExpect(queryParamNameSaved).toHaveText(customPluginDetails.paramName);
    wdioExpect(cookieNameSaved).toHaveText(customPluginDetails.cookieName);
  });

  it('User can modify Auth Token Location', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue(customPluginDetails.authHeaderUpdated);
    apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.setValue(customPluginDetails.cookieNameUpdated);
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue(customPluginDetails.paramNameUpdated);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Modified Auth Token Location is displayed after page reload', () => {
    browser.refresh();
    let authKeyHeaderNameSaved = $('//label[text()="Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    wdioExpect(authKeyHeaderNameSaved).toHaveText(customPluginDetails.authHeaderUpdated);
    wdioExpect(queryParamNameSaved).toHaveText(customPluginDetails.paramNameUpdated);
    wdioExpect(cookieNameSaved).toHaveText(customPluginDetails.cookieNameUpdated);
  });

  it('User can disable Auth Token Location', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX.click();
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Auth Token Location is not displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).not.toBeChecked();
  });
  
  it('User can enable Raw Body and Require Session', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE.click();
    apis_page.OAS_CUSTOM_FUNCTION_NAME_INPUT.setValue(customPluginDetails.functionName);
    apis_page.OAS_CUSTOM_PATH_INPUT.setValue(customPluginDetails.path);
    apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE.click();
    apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Raw Body and Require Session is displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE).toBeChecked();
    //wdioExpect(apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE).toBeChecked();
  });

  it('User can disable Raw Body and Require Session', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE.click();
    apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Raw Body and Require Session is not displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_CUSTOM_RAW_BODY_TOGGLE).not.toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_REQUIRE_SESSION_TOGGLE).not.toBeChecked();
  });

  it('User can enable ID Extractor - Header with Value', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE.click();
    apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Header');
    apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Value');
    apis_page.OAS_CUSTOM_HEADER_NAME_INPUT.setValue(customPluginDetails.authHeader);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Header with Value data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let headerNameSaved = $('//span[text()="Header Name"]//following::div[2]');
    wdioExpect(extractFromSaved).toHaveText('Header');
    wdioExpect(extractWithSaved).toHaveText('Value');
    wdioExpect(headerNameSaved).toHaveText(customPluginDetails.authHeader);
  });

  it('User can modify ID Extractor Header Name', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_HEADER_NAME_INPUT.setValue(customPluginDetails.authHeaderUpdated);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Modified Header Name data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let headerNameSaved = $('//span[text()="Header Name"]//following::div[2]');
    wdioExpect(headerNameSaved).toHaveText(customPluginDetails.authHeaderUpdated);
  });

  it('User can enable ID Extractor - Form with Regex', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Form');
    apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Regex');
    apis_page.OAS_CUSTOM_FORM_PARTAM_NAME_INPUT.setValue(customPluginDetails.formParamName);
    apis_page.OAS_CUSTOM_REGEXP_INPUT.setValue(customPluginDetails.regex);
    apis_page.OAS_CUSTOM_REGEXP_INDEX_INPUT.setValue(customPluginDetails.regexIndex);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Form with Regex data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let paramNameSaved = $('//span[text()="Form Param Name"]//following::div[2]');
    let regexSaved = $('//span[text()="Regexp"]//following::div[2]');
    let regexIndexSaved = $('//span[text()="Regexp Match Index"]//following::div[2]');
    wdioExpect(extractFromSaved).toHaveText('Form');
    wdioExpect(extractWithSaved).toHaveText('Regex');
    wdioExpect(paramNameSaved).toHaveText(customPluginDetails.formParamName);
    wdioExpect(regexSaved).toHaveText(customPluginDetails.regex);
    wdioExpect(regexIndexSaved).toHaveText(customPluginDetails.regexIndex);
  });

  it('User can modify ID Extractor Form name and Regex', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_FORM_PARTAM_NAME_INPUT.setValue(customPluginDetails.formParamNameUpdated);
    apis_page.OAS_CUSTOM_REGEXP_INPUT.setValue(customPluginDetails.regexUpdated);
    apis_page.OAS_CUSTOM_REGEXP_INDEX_INPUT.setValue(customPluginDetails.regexIndexUpdated);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Modified Form name and Regex data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let paramNameSaved = $('//span[text()="Form Param Name"]//following::div[2]');
    let regexSaved = $('//span[text()="Regexp"]//following::div[2]');
    let regexIndexSaved = $('//span[text()="Regexp Match Index"]//following::div[2]');
    wdioExpect(paramNameSaved).toHaveText(customPluginDetails.formParamNameUpdated);
    wdioExpect(regexSaved).toHaveText(customPluginDetails.regexUpdated);
    wdioExpect(regexIndexSaved).toHaveText(customPluginDetails.regexIndexUpdated);
  });

  it('User can enable ID Extractor - Body with Xpath', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_EXTRACT_FROM_DROPDOWN.selectOption('Body');
    apis_page.OAS_CUSTOM_EXTRACT_WITH_DROPDOWN.selectOption('Xpath');
    apis_page.OAS_CUSTOM_XPATH_INPUT.setValue(customPluginDetails.xpath);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Body with Xpath data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let extractFromSaved = $('//span[text()="Extract From"]//following::div[2]');
    let extractWithSaved = $('//span[text()="Extract With"]//following::div[2]');
    let xpathNameSaved = $('//span[text()="XPath expression"]//following::div[2]');
    wdioExpect(extractFromSaved).toHaveText('Body');
    wdioExpect(extractWithSaved).toHaveText('Xpath');
    wdioExpect(xpathNameSaved).toHaveText(customPluginDetails.xpath);
  });

  it('User can modify ID Extractor Xpath expression', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_XPATH_INPUT.setValue(customPluginDetails.xpathUpdated);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Modified Xpath expression is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).toBeChecked();
    let xpathNameSaved = $('//span[text()="XPath expression"]//following::div[2]');
    wdioExpect(xpathNameSaved).toHaveText(customPluginDetails.xpathUpdated);
  });

  it('User can disable ID Extractor', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Header with Value data is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_CUSTOM_IDEXTRACTOR_TOGGLE).not.toBeChecked();
  });

});
