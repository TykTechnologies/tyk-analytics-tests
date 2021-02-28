import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';
import { expect } from 'chai';

describe('Test mandatory fields on OAS API designer page', () => {
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
    wdioExpect(apis_page.OAS_API_NAME_INPUT).toHaveAttr('error', 'API Name is required');    
  });

  it('API Name is required on main designer page', () => {
    apis_page.OAS_API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_API_NAME_INPUT.setValue('');
    apis_page.OAS_SAVE_BUTTON.click();    
    wdioExpect(apis_page.OAS_API_NAME_INPUT).toHaveAttr('error', 'API Name is required');
  });

  it('Listen Path is required on main designer page', () => {
    wdioExpect(apis_page.OAS_LISTEN_PATH_INPUT).toHaveAttr('error', 'Listen Path is required');
  });

  it('Target URL is required on main designer page', () => {
    wdioExpect(apis_page.OAS_TARGET_URL_INPUT).toHaveAttr('error', 'Target URL is required');
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
    wdioExpect(apis_page.OAS_AUTHENTICATION_DROPDOWN).toHaveAttr('error', 'Auth Key Header Name is required');
  });

});