import { test, assert } from '@fixtures';

import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

test('Portal Settings - emails', async ({ createUserAndLogin, main_page }) => {
  const globalSettingsInputs = {
    from_address: "example@tyk.io",
    name_of_sender: "sender example"
  };

  const emailSettingsInput = {
    subject: "subject text",
    body: "body text",
    sign_off_text: "sign off text"
  };

  const tableExpectedValues = {
    first_row: ["Welcome", "Disabled", ""],
    first_row_active: ["Welcome", "Active", ""],
    second_row: ["API Access Approval", "Disabled", ""]
  };

  const cssExample = "h1 {color: red;}";

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('User should see proper default values', async () => {
    await main_page.openPortalSettings();
   await admin_settings_page.EMAILS_TAB_BUTTON.click();
   await admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    await assert(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue("");
    await assert(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue("");
    compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });

  await test.step('User is able to edit global email settings', async () => {    
   await admin_settings_page.FROM_ADDRESS_INPUT.fill(globalSettingsInputs.from_address);
   await admin_settings_page.NAME_OF_SENDER_INPUT.fill(globalSettingsInputs.name_of_sender);
   await admin_settings_page.SAVE_BUTTON.click();
    assert(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User is able to edit Welcome email settings', async () => {    
   await admin_settings_page.TABLE.getRow(0).locator('button').click();
   await admin_settings_page.EMAILS_OPTIONS_ENABLE_TOGGLE.click();
   await admin_settings_page.EMAIL_OPTIONS_SUBJECT_INPUT.fill(emailSettingsInput.subject);
   await admin_settings_page.EMAIL_OPTIONS_BODY_INPUT.fill(emailSettingsInput.body);
   await admin_settings_page.EMAIL_OPTIONS_SIGNOFF_INPUT.fill(emailSettingsInput.sign_off_text);
   await admin_settings_page.EMAIL_OPTIONS_SAVE_BUTTON.click();
    compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
   await admin_settings_page.SAVE_BUTTON.click();
    assert(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User is able to edit global email CSS', async () => {
    browser.refresh();
   await admin_settings_page.EMAILS_TAB_BUTTON.click();
   await admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
   await admin_settings_page.CSS_EDITOR_INPUT.fill(cssExample);
   await admin_settings_page.SAVE_EMAIL_CSS_BUTTON.click();
   await admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
    await assert(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeDisplayed();
   await admin_settings_page.SAVE_BUTTON.click();
  });

  await test.step('User should see saved values after re-load', async () => {
    browser.refresh();
   await admin_settings_page.EMAILS_TAB_BUTTON.click();
   await admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    await assert(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue(globalSettingsInputs.from_address);
    await assert(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue(globalSettingsInputs.name_of_sender);
    compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
   await admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
    await assert($(`span=h1`)).toBeDisplayed();
   await admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
  });

  await test.step('User should be  able to reset email settings', async () => {
    browser.refresh();
   await admin_settings_page.EMAILS_TAB_BUTTON.click();
   await admin_settings_page.RESET_ALL_EMAILS_BUTTON.click();
   await admin_settings_page.CONTINUE_AND_RESET_BUTTON.click();
    await assert(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeDisplayed();
   await admin_settings_page.SAVE_BUTTON.click();
    browser.refresh();
   await admin_settings_page.EMAILS_TAB_BUTTON.click();
    compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });  
});

const compareTableRowsWithExpected = (firstRowExpected, secondRowExpected) => {
  const firstRow = admin_settings_page.TABLE.getRowValues(0);
  const secondRow = admin_settings_page.TABLE.getRowValues(1);
  assert(firstRow).to.have.same.members(firstRowExpected); 
  assert(secondRow).to.have.same.members(secondRowExpected); 
};