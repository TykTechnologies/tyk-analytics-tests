import { test, assert } from '@fixtures';

test('Portal Settings - API access manipulations', async ({ main_page, admin_settings_page, page }) => {
  const inputs = {
    provider: "Okta",
    grant_types: ["Refresh Token", "Password"],
    token_endpoint_auth: "Client Secret - Post",
    response_types: ["Token", "Authorization Code"],
    idp_host: "http://localhost",
    client_registration_endpoint: "http://localhost/client",
    token: "testToken"
  };
  const errorElementClass = /has-error/;

  await test.step('DCR should be disabled by default', async () => {
    await main_page.openPortalSettings();
    await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    assert(await admin_settings_page.DCR_TOGGLE.isSelected()).toBeFalsy();
  });

  await test.step('If DCR is enabled fields become mandatory', async () => {
    await admin_settings_page.DCR_TOGGLE.click();
    await admin_settings_page.SAVE_BUTTON.click();
    const dropdowns = [admin_settings_page.DCR_PROVIDERS_DROPDOWN, admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN,
      admin_settings_page.DCR_GRANT_TYPES_DROPDOWN, admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN];
    for (const dropdown of dropdowns) {
      await assert(dropdown).toHaveAttribute("class", errorElementClass);
    }
    await assert(admin_settings_page.DCR_HOST_INPUT).toHaveAttribute("error", "Enter an IDP host");
    await assert(admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT).toHaveAttribute("error", "Enter an endpoint");
    await assert(admin_settings_page.DCR_TOKEN_INPUT).toHaveAttribute("error", ""); //Token is not a mandatory field -> no error
  });

  await test.step('User should be able to edit DCR details and save changes without error', async () => {
    await admin_settings_page.DCR_TOKEN_INPUT.scrollIntoView();
    await admin_settings_page.DCR_PROVIDERS_DROPDOWN.selectOption(inputs.provider);
    await admin_settings_page.DCR_GRANT_TYPES_DROPDOWN.selectOptions(inputs.grant_types);
    await admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN.selectOption(inputs.token_endpoint_auth);
    await admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN.selectOptions(inputs.response_types);
    await admin_settings_page.DCR_HOST_INPUT.fill(inputs.idp_host);
    await admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT.fill(inputs.client_registration_endpoint);
    await admin_settings_page.DCR_TOKEN_INPUT.fill(inputs.token);
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });

  await test.step('User should see saved values after re-load values', async () => {
    await page.reload();
    await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    assert(await admin_settings_page.DCR_TOGGLE.isSelected()).toBeTruthy();
    await assert(admin_settings_page.DCR_PROVIDERS_DROPDOWN.locator(`span:text("${inputs.provider}")`)).toBeVisible();
    for (const grant_type of inputs.grant_types) {
      await assert(admin_settings_page.DCR_GRANT_TYPES_DROPDOWN.locator(`span:text("${grant_type}")`)).toBeVisible();
    }
    await assert(admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN.locator(`span:text("${inputs.token_endpoint_auth}")`)).toBeVisible();
    for (const response_type of inputs.response_types) {
      await assert(admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN.locator(`span:text("${response_type}")`)).toBeVisible();
    }
    await assert(admin_settings_page.DCR_HOST_INPUT).toHaveValue(inputs.idp_host);
    await assert(admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT).toHaveValue(inputs.client_registration_endpoint);
    await assert(admin_settings_page.DCR_TOKEN_INPUT).toHaveValue(inputs.token);
  });

  await test.step('User is able to save Settings with DCR turned off (fields are no longer mandatory)', async () => {
    await admin_settings_page.DCR_HOST_INPUT.click();
    await admin_settings_page.DCR_HOST_INPUT.clear();
    await admin_settings_page.DCR_TOGGLE.click();
    assert(await admin_settings_page.DCR_TOGGLE.isSelected()).toBeFalsy();
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });
});