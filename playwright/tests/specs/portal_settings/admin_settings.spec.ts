import { test, assert } from '@fixtures';

test('Portal Settings main Admin page', async ({ main_page, admin_settings_page, page }) => {
  const email = "test_notification_email@tyk.io";
  
  await test.step('User should see proper default values', async () => {
    await main_page.openPortalSettings();
    await assert(admin_settings_page.ACCESS_REQUEST_INPUT).toHaveValue('');
    assert(await admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.isSelected()).toBeFalsy();
    assert(await admin_settings_page.DEVELOPER_LOGIN_TOGGLE.isSelected()).toBeFalsy();
    assert(await admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.isSelected()).toBeFalsy();
  });

  await test.step('User should be able to edit all fields and save changes without error', async () => {    
    await admin_settings_page.ACCESS_REQUEST_INPUT.fill(email);
    await admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.click();
    await admin_settings_page.DEVELOPER_LOGIN_TOGGLE.click();
    await admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.click();
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });

  await test.step('User should see saved values after re-load values', async () => {
    await page.reload();
    await assert(admin_settings_page.ACCESS_REQUEST_INPUT).toHaveValue(email);
    assert(await admin_settings_page.DEVELOPER_SIGN_UP_TOGGLE.isSelected()).toBeTruthy();
    assert(await admin_settings_page.DEVELOPER_LOGIN_TOGGLE.isSelected()).toBeTruthy();
    assert(await admin_settings_page.RESTRICTED_CATALOGUE_TOGGLE.isSelected()).toBeTruthy();
  });
});