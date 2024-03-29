import { test, assert } from '@fixtures';

test('Portal Settings - emails', async ({ main_page, admin_settings_page, page }) => {
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

  const compareTableRowsWithExpected = async (firstRowExpected: string[], secondRowExpected: string[]) => {
    const firstRow = await admin_settings_page.TABLE.getRowValues(0);
    const secondRow = await admin_settings_page.TABLE.getRowValues(1);
    assert(firstRow).toStrictEqual(firstRowExpected);
    assert(secondRow).toStrictEqual(secondRowExpected);
  };

  await test.step('User should see proper default values', async () => {
    await main_page.openPortalSettings();
    await admin_settings_page.EMAILS_TAB_BUTTON.click();
    await admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    await assert(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue("");
    await assert(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue("");
    await compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });

  await test.step('User is able to edit global email settings', async () => {
    await admin_settings_page.FROM_ADDRESS_INPUT.fill(globalSettingsInputs.from_address);
    await admin_settings_page.NAME_OF_SENDER_INPUT.fill(globalSettingsInputs.name_of_sender);
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });

  await test.step('User is able to edit Welcome email settings', async () => {
    const firstRow = await admin_settings_page.TABLE.getRow(0);
    await firstRow.locator('button').click();
    await admin_settings_page.EMAILS_OPTIONS_ENABLE_TOGGLE.click();
    await admin_settings_page.EMAIL_OPTIONS_SUBJECT_INPUT.fill(emailSettingsInput.subject);
    await admin_settings_page.EMAIL_OPTIONS_BODY_INPUT.fill(emailSettingsInput.body);
    await admin_settings_page.EMAIL_OPTIONS_SIGNOFF_INPUT.fill(emailSettingsInput.sign_off_text);
    await admin_settings_page.EMAIL_OPTIONS_SAVE_BUTTON.click();
    await compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
    await admin_settings_page.SAVE_BUTTON.click();
    await admin_settings_page.checkIfSettingsUpdatedPopUpDisplayed();
  });

  await test.step('User is able to edit global email CSS', async () => {
    await page.reload();
    await admin_settings_page.EMAILS_TAB_BUTTON.click();
    await admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
    await admin_settings_page.CSS_EDITOR_INPUT.fill(cssExample);
    await admin_settings_page.SAVE_EMAIL_CSS_BUTTON.click();
    await admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
    await assert(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeVisible();
    await admin_settings_page.SAVE_BUTTON.click();
  });

  await test.step('User should see saved values after re-load', async () => {
    await page.reload();
    await admin_settings_page.EMAILS_TAB_BUTTON.click();
    await admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    await assert(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue(globalSettingsInputs.from_address);
    await assert(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue(globalSettingsInputs.name_of_sender);
    await compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
    await admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
    await assert(page.locator(`span:text("h1")`)).toBeVisible();
    await admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
  });

  await test.step('User should be  able to reset email settings', async () => {
    await page.reload();
    await admin_settings_page.EMAILS_TAB_BUTTON.click();
    await admin_settings_page.RESET_ALL_EMAILS_BUTTON.click();
    await admin_settings_page.CONTINUE_AND_RESET_BUTTON.click();
    await assert(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeVisible();
    await admin_settings_page.SAVE_BUTTON.click();
    await page.reload();
    await admin_settings_page.EMAILS_TAB_BUTTON.click();
    await compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });
});

