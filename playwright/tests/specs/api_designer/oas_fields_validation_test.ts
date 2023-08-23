import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';
import { expect } from 'chai';

xtest('Test mandatory fields on OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  const apiName = "oas-api-validation-test";
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('API Name is required on popup', async () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.OAS_NEXT_BUTTON.click();
    let apiNameErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.info.name"]//following::p[1]')
    await assert(apiNameErrorMessage).toHaveText('API Name is required');    
  });

  await test.step('API Name is required on main designer page', async () => {
   await apis_page.API_NAME_INPUT.fill(apiName);
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('');
   await apis_page.OAS_SAVE_BUTTON.click(); 
    let apiNameErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.info.name"]//following::p[1]')
    await assert(apiNameErrorMessage).toHaveText('API Name is required');
  });

  await test.step('Listen Path is required on main designer page', async () => {
    let listenPathErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.server.listenPath.value"]//following::p[1]');
    await assert(listenPathErrorMessage).toHaveText('Listen Path is required');
  });

  await test.step('Target URL is required on main designer page', async () => {
    let targetURLErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.upstream.url"]//following::p[1]');
    await assert(targetURLErrorMessage).toHaveText('Target URL is required');
  });

  await test.step('Access is required on main designer page', async () => {
    let accessErrorMessage = await this.page.locator('//span[@title="Select access"]//following::p[contains(@class, "error-message")]');  
    await assert(accessErrorMessage).toHaveText('Access is required');
  });

  await test.step('GW Status is required on main designer page', async () => {  
    let statusErrorMessage = await this.page.locator('//span[@title="Select status"]//following::p[contains(@class, "error-message")]');  
    await assert(statusErrorMessage).toHaveText('Status is required');
  });

  await test.step('Authentication is required on main designer page', async () => {
    let authErrorMessage = await this.page.locator('//span[@title="Select authentication type"]//following::p[contains(@class, "error-message")]');  
    await assert(authErrorMessage).toHaveText('Authentication is required');
  });

  await test.step('Auth Key Header is required on main designer page', async () => {
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption('Auth Token');
    let authHeaderErrorMessage = await this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.token.header.name"]//following::p[1]');
    await assert(authHeaderErrorMessage).toHaveText('Auth Key Header Name is required');
  });

});