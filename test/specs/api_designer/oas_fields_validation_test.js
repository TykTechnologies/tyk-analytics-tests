import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';
import { expect } from 'chai';

xdescribe('Test mandatory fields on OAS API designer page', () => {
  const apiName = "oas-api-validation-test";
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('API Name is required on popup', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    apis_page.DESIGN_API_BOX.click();
    apis_page.OAS_NEXT_BUTTON.click();
    let apiNameErrorMessage = $('//input[@name="x-tyk-api-gateway.info.name"]//following::p[1]')
    wdioExpect(apiNameErrorMessage).toHaveText('API Name is required');    
  });

  it('API Name is required on main designer page', () => {
    apis_page.API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('');
    apis_page.OAS_SAVE_BUTTON.click(); 
    let apiNameErrorMessage = $('//input[@name="x-tyk-api-gateway.info.name"]//following::p[1]')
    wdioExpect(apiNameErrorMessage).toHaveText('API Name is required');
  });

  it('Listen Path is required on main designer page', () => {
    let listenPathErrorMessage = $('//input[@name="x-tyk-api-gateway.server.listenPath.value"]//following::p[1]');
    wdioExpect(listenPathErrorMessage).toHaveText('Listen Path is required');
  });

  it('Target URL is required on main designer page', () => {
    let targetURLErrorMessage = $('//input[@name="x-tyk-api-gateway.upstream.url"]//following::p[1]');
    wdioExpect(targetURLErrorMessage).toHaveText('Target URL is required');
  });

  it('Access is required on main designer page', () => {
    let accessErrorMessage = $('//span[@title="Select access"]//following::p[contains(@class, "error-message")]');  
    wdioExpect(accessErrorMessage).toHaveText('Access is required');
  });

  it('GW Status is required on main designer page', () => {  
    let statusErrorMessage = $('//span[@title="Select status"]//following::p[contains(@class, "error-message")]');  
    wdioExpect(statusErrorMessage).toHaveText('Status is required');
  });

  it('Authentication is required on main designer page', () => {
    let authErrorMessage = $('//span[@title="Select authentication type"]//following::p[contains(@class, "error-message")]');  
    wdioExpect(authErrorMessage).toHaveText('Authentication is required');
  });

  it('Auth Key Header is required on main designer page', () => {
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption('Auth Token');
    let authHeaderErrorMessage = $('//input[@name="x-tyk-api-gateway.server.authentication.token.header.name"]//following::p[1]');
    wdioExpect(authHeaderErrorMessage).toHaveText('Auth Key Header Name is required');
  });

});