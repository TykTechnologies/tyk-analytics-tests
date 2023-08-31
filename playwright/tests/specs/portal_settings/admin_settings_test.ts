import { test, assert } from '@fixtures';

import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

test('Portal Settings main Admin page', async ({ createUserAndLogin, main_page }) => {
  const email = "test_notification_email@tyk.io";
  
  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User should see proper default values', async () => {
    await main_page.openPortalSettings();
    await assert(admin_settings_page.ACCESS_REQUEST_INPUT).toHaveValue('');
    assert(admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.isSelected()).toBeFalsy();
    assert(admin_settings_page.DEVELOPER_LOGIN_TOGGLE.isSelected()).toBeFalsy();
    assert(admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.isSelected()).toBeFalsy();
  });

  await test.step('User should be able to edit all fields and save changes without error', async () => {    
   await admin_settings_page.ACCESS_REQUEST_INPUT.fill(email);
   await admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.click();
   await admin_settings_page.DEVELOPER_LOGIN_TOGGLE.click();
   await admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.click();
   await admin_settings_page.SAVE_BUTTON.click();
    assert(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should see saved values after re-load values', async () => {
    browser.refresh();
    await assert(admin_settings_page.ACCESS_REQUEST_INPUT).toHaveValue(email);
    assert(admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.isSelected()).toBeTruthy();
    assert(admin_settings_page.DEVELOPER_LOGIN_TOGGLE.isSelected()).toBeTruthy();
    assert(admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.isSelected()).toBeTruthy();
  });
});