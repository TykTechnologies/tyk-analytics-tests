import { test, assert } from '@fixtures';

import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

test('Portal Settings - API access manipulations', async ({ createUserAndLogin, main_page }) => {
  const inputs = {
    provider: "Okta",
    grant_types: ["Refresh Token", "Password"],
    token_endpoint_auth: "Client Secret - Post",
    response_types: ["Token", "Authorization Code"],
    idp_host: "http://localhost",
    client_registration_endpoint: "http://localhost/client",
    token: "testToken"
  };
  const errorElementClass = "has-error";

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('DCR should be disabled by default', async () => {
    main_page.openPortalSettings();
   await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    expect(admin_settings_page.DCR_TOGGLE.isSelected()).to.be.false;
  });

  await test.step('If DCR is enabled fields become mandatory', async () => {
   await admin_settings_page.DCR_TOGGLE.click();
   await admin_settings_page.SAVE_BUTTON.click();
    [admin_settings_page.DCR_PROVIDERS_DROPDOWN, admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN, 
      admin_settings_page.DCR_GRANT_TYPES_DROPDOWN, admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN].forEach(element =>
        wdioExpect(element).toHaveAttrContaining("class", errorElementClass)
      );
    wdioExpect(admin_settings_page.DCR_HOST_INPUT).toHaveAttrContaining("error", "Enter an IDP host");
    wdioExpect(admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT).toHaveAttrContaining("error", "Enter an endpoint");
    wdioExpect(admin_settings_page.DCR_TOKEN_INPUT).toHaveAttrContaining("error", ""); //Token is not a mandatory field -> no error
  });

  await test.step('User should be able to edit DCR details and save changes without error', async () => {    
    admin_settings_page.DCR_TOKEN_INPUT.scrollIntoView();
   await admin_settings_page.DCR_PROVIDERS_DROPDOWN.selectOption(inputs.provider);
    admin_settings_page.DCR_GRANT_TYPES_DROPDOWN.selectOptions(inputs.grant_types);
   await admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN.selectOption(inputs.token_endpoint_auth);
    admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN.selectOptions(inputs.response_types);
   await admin_settings_page.DCR_HOST_INPUT.fill(inputs.idp_host);
   await admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT.fill(inputs.client_registration_endpoint);
   await admin_settings_page.DCR_TOKEN_INPUT.fill(inputs.token);
   await admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('User should see saved values after re-load values', async () => {
    browser.refresh();
   await admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    expect(admin_settings_page.DCR_TOGGLE.isSelected()).to.be.true;
    wdioExpect(admin_settings_page.DCR_PROVIDERS_DROPDOWN.$(`span=${inputs.provider}`)).toBeDisplayed();
    inputs.grant_types.forEach(grant_type => wdioExpect(admin_settings_page.DCR_GRANT_TYPES_DROPDOWN.$(`span=${grant_type}`)).toBeDisplayed());
    wdioExpect(admin_settings_page.DCR_TOKEN_ENDPOINT_DROPDOWN.$(`span=${inputs.token_endpoint_auth}`)).toBeDisplayed();
    inputs.response_types.forEach(response_type => wdioExpect(admin_settings_page.DCR_RESPONSE_TYPE_DROPDOWN.$(`span=${response_type}`)).toBeDisplayed());
    wdioExpect(admin_settings_page.DCR_HOST_INPUT).toHaveValue(inputs.idp_host);
    wdioExpect(admin_settings_page.DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT).toHaveValue(inputs.client_registration_endpoint);
    wdioExpect(admin_settings_page.DCR_TOKEN_INPUT).toHaveValue(inputs.token);
  });

  await test.step('User is able to save Settings with DCR turned off (fields are no longer mandatory)', async () => {
   await admin_settings_page.DCR_HOST_INPUT.click();
    admin_settings_page.DCR_HOST_INPUT.clear();
   await admin_settings_page.DCR_TOGGLE.click();
    expect(admin_settings_page.DCR_TOGGLE.isSelected()).to.be.false;
   await admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });
});