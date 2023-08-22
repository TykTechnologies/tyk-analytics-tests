import { test, assert } from '@fixtures';

import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

test('Portal Settings - API access manipulations', async ({ createUserAndLogin, main_page }) => {
  const redirectUrl = "http://test";
  const numberfAllowedRequests = "5";

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User should see proper default values', async () => {
    main_page.openPortalSettings();
   await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    expect(admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).to.be.false;
    expect(admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).to.be.false;
    expect(admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).to.be.false;
    wdioExpect(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue("0");
  });

  await test.step('User should be able to edit all fields and save changes without error', async () => {    
   await admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.click();
   await admin_settings_page.HIDE_API_SECRET_TOGGLE.click();
   await admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.click();
   await admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.click();
   await admin_settings_page.REDIRECT_URL_INPUT.fill(redirectUrl);
   await admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT.fill(numberfAllowedRequests);
   await admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('User should see saved values after re-load values', async () => {
    browser.refresh();
   await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    wdioExpect(admin_settings_page.REDIRECT_URL_INPUT).toHaveValue(redirectUrl);
    wdioExpect(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue(numberfAllowedRequests);
    expect(admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.HIDE_API_SECRET_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).to.be.true;
  });
});