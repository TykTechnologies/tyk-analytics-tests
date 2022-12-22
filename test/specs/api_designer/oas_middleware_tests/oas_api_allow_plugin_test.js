import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { endpoints_page } from '../../../../lib/pom/Endpoints_page';
import { expect } from 'chai';

describe('Test Allow List plugin on OAS Endpoints designer page', () => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User can add Allow List plugin and save API', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('allow-plugin-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    endpoints_page.addNewEndpoint("/ip", "GET");
    endpoints_page.addMiddlewareByName("Allow List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Allow List plugin is displayed after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Allow List")).to.be.true;
  });

  it('User can disable Allow List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Allow List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Allow List plugin is disabled after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Allow List")).to.be.true;
  });

  it('User can enable Allow List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Allow List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Allow List plugin is enabled after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Allow List")).to.be.false;
  });

  it('User can remove Allow List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.removeMiddlewareByName("Allow List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Allow List plugin is removed after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Allow List")).to.be.false;
  });

});
