import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../../config_variables';
import { expect } from 'chai';

describe('Test Custom Authentication (Go and Custom) in OAS API designer page', () => {
  let envDetails;

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
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Custom Authentication (Go Plugin)");
    let basicAuthUrl = $('a*=Learn more about Custom Authentication (Go Plugin)');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/plugins/supported-languages/golang/');
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toExist();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('GO auth is displayed after page reload', () => {
    browser.refresh();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Custom Authentication (Go Plugin)');
  });

  it('User can create API with Custom auth plugin', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH);//TO BE REMOVED WHEN RELEASED
    apis_page.OAS_ADD_API_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('custom-auth-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("Custom Authentication (Python, CoProcess, JSVM Plugins)");
    let basicAuthUrl = $('a*=Learn more about Custom Authentication (Python, CoProcess, JSVM Plugins)');
    wdioExpect(basicAuthUrl).toHaveLink('https://tyk.io/docs/plugins/supported-languages/rich-plugins/python/custom-auth-python-tutorial/');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue('custom-header');
    apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue('custom-param');
    apis_page.OAS_CUSTOM_COOKIE_VALUE_INPUT.setValue('custom-cookie');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('GO auth is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    const cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Custom Authentication (Python, CoProcess, JSVM Plugins)');
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('custom-header');
    wdioExpect(queryParamNameSaved).toHaveText('custom-param');
    wdioExpect(cookieNameSaved).toHaveText('custom-cookie');
  });

  it('User can modify API with Custom auth plugin', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_CUSTOM_AUTH_HEADER_INPUT.setValue('custom-header-new');
    apis_page.OAS_CUSTOM_USE_COOKIE_BOX.click();
    apis_page.OAS_CUSTOM_QUERY_PARAM_INPUT.setValue('custom-param-new');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Custom auth is displayed after page reload', () => {
    browser.refresh();
    const authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    const queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    apis_page.SIDE_MENU_SERVER_LINK.click();
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('Custom Authentication (Python, CoProcess, JSVM Plugins)');
    wdioExpect(apis_page.OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_CUSTOM_USE_COOKIE_BOX).not.toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('custom-header-new');
    wdioExpect(queryParamNameSaved).toHaveText('custom-param-new');
  });

});