import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import config_variables, { URL, LANDING_PAGE_PATH } from './../../../config_variables';

describe('Test Landing Page', () => {
  const testedURL = config_variables.URL + config_variables.LANDING_PAGE_PATH;
  const dashboard_connection = new Dashboard_connection();
  const apiName = "landingpagetest";
  let $apiTableElement;
  let apiDefinition;
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should see Landing Page after loggin in with 0 APIs', () => {
    browser.url(config_variables.URL + config_variables.LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    
    wdioExpect(browser).toHaveUrl(testedURL);
    wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
  });

  it('User should see Landing Page when navigating with 0 APIs', () => {
    main_page.KEYS_NAVIAGTION_BUTTON.click();
    main_page.APIs_NAVIAGTION_BUTTON.click();
    browser.url(config_variables.URL + config_variables.LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED

    wdioExpect(browser).toHaveUrl(testedURL);
    wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
  });

  it('User should not see Landing Page when loggin in with 1 API', () => {
    main_page.logOut();
    apiDefinition = newAPIdefinitionWithDefaults({"name":apiName});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    
    wdioExpect(browser).not.toHaveUrl(testedURL);
    wdioExpect(apis_page.DESIGN_API_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).not.toBeDisplayed();
  });

  it('User should not see Landing Page when navigating with 1 API', () => {
    main_page.KEYS_NAVIAGTION_BUTTON.click();
    main_page.APIs_NAVIAGTION_BUTTON.click();

    wdioExpect(browser).not.toHaveUrl(testedURL);
    wdioExpect(apis_page.DESIGN_API_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).not.toBeDisplayed();
  });

  it('User should see Landing Page after all APIs were deleted', () => {
    $apiTableElement = $(`a=${apiName}`).click();
    apis_page.OPTIONS_BUTTON.click();
    apis_page.DELETE_BUTTON.click();
    apis_page.DELETE_API_BUTTON.click();

    browser.url(config_variables.URL + config_variables.LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    wdioExpect(browser).toHaveUrl(testedURL);
    wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
  });

});