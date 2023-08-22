import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { endpoints_page } from '../../../../lib/pom/Endpoints_page';
import { expect } from 'chai';

test('Test Allow List plugin on OAS Endpoints designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  }); 

  await test.step('User can add Allow List plugin and save API', async () => {
    main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('allow-plugin-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    endpoints_page.addNewEndpoint("/ip", "GET");
    endpoints_page.addMiddlewareByName("Allow List");
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Allow List plugin is displayed after page reload', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Allow List")).to.be.true;
  });

  await test.step('User can disable Allow List plugin and save API', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
   await apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Allow List");
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Allow List plugin is disabled after page reload', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Allow List")).to.be.true;
  });

  await test.step('User can enable Allow List plugin and save API', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
   await apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Allow List");
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Allow List plugin is enabled after page reload', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Allow List")).to.be.false;
  });

  await test.step('User can remove Allow List plugin and save API', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
   await apis_page.EDIT_BUTTON.click();
    endpoints_page.removeMiddlewareByName("Allow List");
   await apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('Allow List plugin is removed after page reload', async () => {
    browser.refresh();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Allow List")).to.be.false;
  });

});
