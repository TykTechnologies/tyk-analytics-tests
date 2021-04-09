import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

describe('Portal Settings - emails', () => {
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

  it('User should see proper default values', () => {
    main_page.openPortalSettings();
    admin_settings_page.EMAILS_TAB_BUTTON.click();
    admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    wdioExpect(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue("");
    wdioExpect(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue("");
    compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });

  it('User is able to edit global email settings', () => {    
    admin_settings_page.FROM_ADDRESS_INPUT.setValue(globalSettingsInputs.from_address);
    admin_settings_page.NAME_OF_SENDER_INPUT.setValue(globalSettingsInputs.name_of_sender);
    admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User is able to edit Welcome email settings', () => {    
    admin_settings_page.TABLE.getRow(0).$('button').click();
    admin_settings_page.EMAILS_OPTIONS_ENABLE_TOGGLE.click();
    admin_settings_page.EMAIL_OPTIONS_SUBJECT_INPUT.setValue(emailSettingsInput.subject);
    admin_settings_page.EMAIL_OPTIONS_BODY_INPUT.setValue(emailSettingsInput.body);
    admin_settings_page.EMAIL_OPTIONS_SIGNOFF_INPUT.setValue(emailSettingsInput.sign_off_text);
    admin_settings_page.EMAIL_OPTIONS_SAVE_BUTTON.click();
    compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
    admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User is able to edit global email CSS', () => {
    browser.refresh();
    admin_settings_page.EMAILS_TAB_BUTTON.click();
    admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
    admin_settings_page.CSS_EDITOR_INPUT.setValue(cssExample);
    admin_settings_page.SAVE_EMAIL_CSS_BUTTON.click();
    admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
    wdioExpect(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeDisplayed();
    admin_settings_page.SAVE_BUTTON.click();
  });

  it('User should see saved values after re-load', () => {
    browser.refresh();
    admin_settings_page.EMAILS_TAB_BUTTON.click();
    admin_settings_page.GLOBAL_EMAIL_SETTINGS_BUTTON.click();
    wdioExpect(admin_settings_page.FROM_ADDRESS_INPUT).toHaveValue(globalSettingsInputs.from_address);
    wdioExpect(admin_settings_page.NAME_OF_SENDER_INPUT).toHaveValue(globalSettingsInputs.name_of_sender);
    compareTableRowsWithExpected(tableExpectedValues.first_row_active, tableExpectedValues.second_row);
    admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON.click();
    wdioExpect($(`span=h1`)).toBeDisplayed();
    admin_settings_page.EXIT_CSS_EDITOR_BUTTON.click();
  });

  it('User should be  able to reset email settings', () => {
    browser.refresh();
    admin_settings_page.EMAILS_TAB_BUTTON.click();
    admin_settings_page.RESET_ALL_EMAILS_BUTTON.click();
    admin_settings_page.CONTINUE_AND_RESET_BUTTON.click();
    wdioExpect(admin_settings_page.EDIT_GLOBAL_EMAIL_CSS_BUTTON).toBeDisplayed();
    admin_settings_page.SAVE_BUTTON.click();
    browser.refresh();
    admin_settings_page.EMAILS_TAB_BUTTON.click();
    compareTableRowsWithExpected(tableExpectedValues.first_row, tableExpectedValues.second_row);
  });  
});

const compareTableRowsWithExpected = (firstRowExpected, secondRowExpected) => {
  const firstRow = admin_settings_page.TABLE.getRowValues(0);
  const secondRow = admin_settings_page.TABLE.getRowValues(1);
  expect(firstRow).to.have.same.members(firstRowExpected); 
  expect(secondRow).to.have.same.members(secondRowExpected); 
};