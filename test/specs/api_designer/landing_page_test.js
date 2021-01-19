import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';

describe('Test Landing Page', () => {
  const testedURL = URL + LANDING_PAGE_PATH;
  const dashboard_connection = new Dashboard_connection();
  const apiName = "landingpagetest";
  let $apiTableElement;
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should see Landing Page after loggin in with 0 APIs', () => {
    browser.url(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    checkBoxesAreDisplayed();
  });

  it('User should see Landing Page when navigating with 0 APIs', () => {
    main_page.KEYS_NAVIAGTION_BUTTON.click();
    main_page.APIs_NAVIAGTION_BUTTON.click();
    browser.url(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    checkBoxesAreDisplayed();
  });

  it('User should not see Landing Page when loggin in with 1 API', () => {
    main_page.logOut();
    const apiDefinition = newAPIdefinitionWithDefaults({"name":apiName});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    checkBoxesAreNotDisplayed();
  });

  it('User should not see Landing Page when navigating with 1 API', () => {
    main_page.KEYS_NAVIAGTION_BUTTON.click();
    main_page.APIs_NAVIAGTION_BUTTON.click();
    checkBoxesAreNotDisplayed();
  });

  it('User should see Landing Page after all APIs were deleted', () => {
    $apiTableElement = $(`a=${apiName}`).click();
    apis_page.OPTIONS_BUTTON.click();
    apis_page.DELETE_BUTTON.click();
    apis_page.DELETE_API_BUTTON.click();
    browser.url(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    checkBoxesAreDisplayed();
  });

function checkBoxesAreDisplayed() {
  wdioExpect(browser).toHaveUrl(testedURL);
  //workaround for temporary problem with not loading landing page from URL on env
  browser.pause(2000);
  browser.refresh();
  wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
  wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
  wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
}

function checkBoxesAreNotDisplayed() {
  wdioExpect(browser).not.toHaveUrl(testedURL);
  wdioExpect(apis_page.DESIGN_API_BOX).not.toBeDisplayed();
  wdioExpect(apis_page.IMPORT_API_BOX).not.toBeDisplayed();
  wdioExpect(apis_page.TRY_DEMO_BOX).not.toBeDisplayed();
}

});