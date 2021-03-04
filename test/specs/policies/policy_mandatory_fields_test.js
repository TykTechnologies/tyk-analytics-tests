import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_mandatory_fields',
  keyEpiryTime: "1 hour"
};

describe('Create/update/delete tags on policy', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API definition via dashboard API', () => {
    const apiDefinition = newAPIdefinitionWithDefaults({"name":policyDetails.apiName});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });

  it('User should see error message on Access Rights tab if no API was selected', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.CREATE_POLICY_BUTTON.click();
    wdioExpect(policies_page.API_ERROR_ICON).toBeDisplayed();
    wdioExpect(policies_page.CONFIG_ERROR_ICON).toBeDisplayed();
    wdioExpect(policies_page.API_MANDATORY_TEXT).toBeDisplayed();
  });

  it('User should not see errors on Access Rights tab if 1 API was selected', () => {
    policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    wdioExpect(policies_page.API_ERROR_ICON).not.toBeDisplayed();
    wdioExpect(policies_page.API_MANDATORY_TEXT).not.toBeDisplayed();
    wdioExpect(policies_page.CONFIG_ERROR_ICON).toBeDisplayed();
  });

  it('User should see errors on Configurations tab - Name and Expiry missing', () => {
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.NAME_MANDATORY_TEXT).toBeDisplayed();
    wdioExpect(policies_page.EXPIRY_MANDATORY_TEXT).toBeDisplayed();
  });

  it('User should be able to save Policy onces all mandatory fields are entered', () => {
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    wdioExpect(policies_page.CONFIG_ERROR_ICON).not.toBeDisplayed();
    wdioExpect(policies_page.NAME_MANDATORY_TEXT).not.toBeDisplayed();
    wdioExpect(policies_page.EXPIRY_MANDATORY_TEXT).not.toBeDisplayed();
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

});