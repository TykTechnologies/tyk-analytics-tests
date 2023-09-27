import { test, assert } from '@fixtures';

test('Portal Settings - API access manipulations', async ({ createUserAndLogin, main_page, admin_settings_page, page }) => {
  const redirectUrl = "http://test";
  const numberfAllowedRequests = "5";

  await test.step('User should see proper default values', async () => {
    await main_page.openPortalSettings();
    await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    assert(await admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).toBeFalsy();
    assert(await admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).toBeFalsy();
    assert(await admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).toBeFalsy();
    await assert(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue("0");
  });

  await test.step('User should be able to edit all fields and save changes without error', async () => {
    await admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.click();
    await admin_settings_page.HIDE_API_SECRET_TOGGLE.click();
    await admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.click();
    await admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.click();
    await admin_settings_page.REDIRECT_URL_INPUT.fill(redirectUrl);
    await admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT.fill(numberfAllowedRequests);
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });

  await test.step('User should see saved values after re-load values', async () => {
    await page.reload();
    await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    await assert(admin_settings_page.REDIRECT_URL_INPUT).toHaveValue(redirectUrl);
    await assert(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue(numberfAllowedRequests);
    assert(await admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).toBeTruthy();
    assert(await admin_settings_page.HIDE_API_SECRET_TOGGLE.isSelected()).toBeTruthy();
    assert(await admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).toBeTruthy();
    assert(await admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).toBeTruthy();
  });
});