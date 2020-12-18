import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
const config_variables = require('../../../config_variables');

describe('Test Landing Page', () => {
  const apiDetails = {
    name: "landingtest"
  };
  let $apiTableElement;

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should see landing page after loggin in with 0 APIs', () => {
    browser.url(config_variables.URL + config_variables.LANDING_PAGE_ENDPOINT); //TO BE REMOVED WHEN RELEASED
    
    wdioExpect(browser).toHaveUrl(config_variables.URL + config_variables.LANDING_PAGE_ENDPOINT);
    wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
  });

  it('User should see landing page when navigating with 0 APIs', () => {
    main_page.KEYS_NAVIAGTION_BUTTON.click();
    main_page.APIs_NAVIAGTION_BUTTON.click();
    browser.url(config_variables.URL + config_variables.LANDING_PAGE_ENDPOINT); //TO BE REMOVED WHEN RELEASED
    
    wdioExpect(browser).toHaveUrl(config_variables.URL + config_variables.LANDING_PAGE_ENDPOINT);
    wdioExpect(apis_page.DESIGN_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.IMPORT_API_BOX).toBeDisplayed();
    wdioExpect(apis_page.TRY_DEMO_BOX).toBeDisplayed();
  });

  it('User should see API listing page when loggin in with 1 API', () => {
    //$apiTableElement.click();
    //apis_page.OPTIONS_BUTTON.click();
    //apis_page.DELETE_BUTTON.click();
    //apis_page.DELETE_API_BUTTON.click();
  });

  it('User should see API listing page when navigating with 1 API', () => {
      //wdioExpect($apiTableElement).not.toBeDisplayed();
  });

  it('User should see landing page after loggin in if all APIs were deleted', () => {
    //wdioExpect($apiTableElement).not.toBeDisplayed();
  });

  it('User should see landing page when navigating if all APIs were deleted', () => {
    //wdioExpect($apiTableElement).not.toBeDisplayed();
  });

});