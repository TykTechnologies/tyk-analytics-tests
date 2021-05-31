import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';

xdescribe('Test Search functionality on OAS API Page', () => {
  const apiName = "oas-api-search-test";
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should be able to open search bar by clicking search icon', () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
    apis_page.DESIGN_API_BOX.click();
    apis_page.OAS_API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_API_REST_RADIO.click();
    apis_page.OAS_NEXT_BUTTON.click();
    wdioExpect(apis_page.OAS_SEARCH_ICON).toBeDisplayed();
    apis_page.OAS_SEARCH_ICON.click();
    wdioExpect(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

  it('User should be able to close search bar by clicking X icon', () => {
    apis_page.OAS_SEARCH_BAR_CLOSE_ICON.click();
    wdioExpect(apis_page.OAS_SEARCH_BAR).not.toBeDisplayed();
  });

  it('User should be able to open search bar with keyboard shortcut ctrl+f', () => {
    browser.keys(["\uE009", "f"]);
    browser.keys("\uE009");
    wdioExpect(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

  it('User should be able to close search bar with keyboard shortcut ESC', () => {
    browser.keys("\uE00C");
    wdioExpect(apis_page.OAS_SEARCH_BAR).not.toBeDisplayed();
  });

  it('User should be able to open search bar with keyboard shortcut cmd+f', () => {
    browser.keys(["\uE03D", "f"]);
    browser.keys("\uE03D");
    wdioExpect(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });
  
  it('User should be able to search by main section title', () => {
    apis_page.OAS_SEARCH_BAR.setValue("Listen path");
    wdioExpect(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_AUTHENTICATION_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_API_NAME_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  it('User should be able to search by "potential match" text', () => {
    apis_page.OAS_SEARCH_BAR.setValue("JWT");
    wdioExpect(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    wdioExpect(apis_page.OAS_HIDDEN_MATCH_MSG).toHaveText('A match for "JWT" can be found in this section, if proper settings are configured');
    wdioExpect(apis_page.OAS_LISTEN_PATH_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_API_NAME_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  it('User should be able to see multiple results when typing', () => {
    apis_page.OAS_SEARCH_BAR.setValue("strip");
    wdioExpect(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    wdioExpect(apis_page.OAS_API_NAME_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  it('User should be able to clear search results', () => {
    apis_page.OAS_SEARCH_BAR_CLEAR_ICON.click();
    browser.pause(2000);
    wdioExpect(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    wdioExpect(apis_page.OAS_API_NAME_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_TARGET_URL_INPUT).toBeDisplayed();
    wdioExpect(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

});