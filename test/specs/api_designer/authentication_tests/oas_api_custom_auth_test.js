import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../../config_variables';
import { expect } from 'chai';

xdescribe('Test Custom Authentication in OAS API designer page', () => {
  let envDetails;
  const goPluginDetails = {
    authType: "Custom Authentication (Go Plugin)",
    url: "https://tyk.io/docs/plugins/supported-languages/golang/"
  };
  const customPluginDetails = {
    authType: "Custom Authentication (Python, CoProcess, JSVM Plugins)",
    url: "https://tyk.io/docs/plugins/supported-languages/rich-plugins/python/custom-auth-python-tutorial/",
    authHeader: "custom-header",
    paramName: "custom-param",
    cookieName: "custom-cookie",
    updatedAuthHeader:"custom-header-updated",
    updatedParamName: "custom-param-updated"
  };

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User can create API with GO auth plugin', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH);//TO BE REMOVED WHEN RELEASED
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_NAME_INPUT.setValue('go-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption(goPluginDetails.authType);
    let basicAuthUrl = $('a*=Learn more about Custom Authentication (Go Plugin)');
    wdioExpect(basicAuthUrl).toHaveLink(goPluginDetails.url);
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toExist();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('GO auth is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText(goPluginDetails.authType);
  });

  it('User can create API with Custom auth plugin', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH);//TO BE REMOVED WHEN RELEASED
    apis_page.OAS_ADD_API_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('custom-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption(customPluginDetails.authType);
    let basicAuthUrl = $('a*=Learn more about Custom Authentication (Python, CoProcess, JSVM Plugins)');
    wdioExpect(basicAuthUrl).toHaveLink(customPluginDetails.url);
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_USEHEADER_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue(customPluginDetails.authHeader);
    apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue(customPluginDetails.paramName);
    apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.setValue(customPluginDetails.cookieName);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('GO auth is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    const cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText(customPluginDetails.authType);
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText(customPluginDetails.authHeader);
    wdioExpect(queryParamNameSaved).toHaveText(customPluginDetails.paramName);
    wdioExpect(cookieNameSaved).toHaveText(customPluginDetails.cookieName);
  });

  it('User can modify API with Custom auth plugin', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue(customPluginDetails.updatedAuthHeader);
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue(customPluginDetails.updatedParamName);
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Custom auth is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText(customPluginDetails.authType);
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText(customPluginDetails.updatedAuthHeader);
    wdioExpect(queryParamNameSaved).toHaveText(customPluginDetails.updatedParamName);
  });

});