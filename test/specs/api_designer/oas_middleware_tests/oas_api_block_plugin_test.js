import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { endpoints_page } from '../../../../lib/pom/Endpoints_page';
import { expect } from 'chai';

xdescribe('Test Block List plugin on OAS Endpoints designer page', () => {
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User can add Block List plugin and save API', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('Block-plugin-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    endpoints_page.addNewEndpoint("/ip", "GET");
    endpoints_page.addMiddlewareByName("Block List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Block List plugin is displayed after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Block List")).to.be.true;
  });

  it('User can disable Block List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Block List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Block List plugin is disabled after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Block List")).to.be.true;
  });

  it('User can enable Block List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.changeMiddlewareStatusByName("Block List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Block List plugin is enabled after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareDisabledByName("Block List")).to.be.false;
  });

  it('User can remove Block List plugin and save API', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    apis_page.EDIT_BUTTON.click();
    endpoints_page.removeMiddlewareByName("Block List");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Block List plugin is removed after page reload', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    expect(endpoints_page.verifyMiddlewareExistsByName("Block List")).to.be.false;
  });

});
