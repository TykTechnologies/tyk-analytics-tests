import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../config_variables';

xtest('Test Search functionality on OAS API Page', async ({ createUserAndLogin, main_page }) => {
  const apiName = "oas-api-search-test";
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User should be able to open search bar by clicking search icon', async () => {
    browser.navigateTo(URL + LANDING_PAGE_PATH); //TO BE REMOVED WHEN RELEASED
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_NAME_INPUT.fill(apiName);
   await apis_page.OAS_API_REST_RADIO.click();
   await apis_page.OAS_NEXT_BUTTON.click();
    await assert(apis_page.OAS_SEARCH_ICON).toBeDisplayed();
   await apis_page.OAS_SEARCH_ICON.click();
    await assert(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

  await test.step('User should be able to close search bar by clicking X icon', async () => {
   await apis_page.OAS_SEARCH_BAR_CLOSE_ICON.click();
    await assert(apis_page.OAS_SEARCH_BAR).not.toBeDisplayed();
  });

  await test.step('User should be able to open search bar with keyboard shortcut ctrl+f', async () => {
    browser.keys(["\uE009", "f"]);
    browser.keys("\uE009");
    await assert(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

  await test.step('User should be able to close search bar with keyboard shortcut ESC', async () => {
    browser.keys("\uE00C");
    await assert(apis_page.OAS_SEARCH_BAR).not.toBeDisplayed();
  });

  await test.step('User should be able to open search bar with keyboard shortcut cmd+f', async () => {
    browser.keys(["\uE03D", "f"]);
    browser.keys("\uE03D");
    await assert(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });
  
  await test.step('User should be able to search by main section title', async () => {
   await apis_page.OAS_SEARCH_BAR.fill("Listen path");
    await assert(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    await assert(apis_page.OAS_AUTHENTICATION_DROPDOWN).not.toBeDisplayed();
    await assert(apis_page.API_NAME_INPUT).not.toBeDisplayed();
    await assert(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  await test.step('User should be able to search by "potential match" text', async () => {
   await apis_page.OAS_SEARCH_BAR.fill("JWT");
    await assert(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    await assert(apis_page.OAS_HIDDEN_MATCH_MSG).toHaveText('A match for "JWT" can be found in this section, if proper settings are configured');
    await assert(apis_page.OAS_LISTEN_PATH_INPUT).not.toBeDisplayed();
    await assert(apis_page.API_NAME_INPUT).not.toBeDisplayed();
    await assert(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  await test.step('User should be able to see multiple results when typing', async () => {
   await apis_page.OAS_SEARCH_BAR.fill("strip");
    await assert(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    await assert(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    await assert(apis_page.API_NAME_INPUT).not.toBeDisplayed();
    await assert(apis_page.OAS_TARGET_URL_INPUT).not.toBeDisplayed();
  });

  await test.step('User should be able to clear search results', async () => {
   await apis_page.OAS_SEARCH_BAR_CLEAR_ICON.click();
    browser.pause(2000);
    await assert(apis_page.OAS_LISTEN_PATH_INPUT).toBeDisplayed();
    await assert(apis_page.OAS_AUTHENTICATION_DROPDOWN).toBeDisplayed();
    await assert(apis_page.API_NAME_INPUT).toBeDisplayed();
    await assert(apis_page.OAS_TARGET_URL_INPUT).toBeDisplayed();
    await assert(apis_page.OAS_SEARCH_BAR).toBeDisplayed();
  });

});