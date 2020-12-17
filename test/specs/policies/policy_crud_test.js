import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_policy',
  policyName: 'policy_auto_test_1',
  policyNameUpdate: 'policy_auto_test_1_update',
  keyEpiryTime: "1 hour",
  keyEpiryTimeUpdateValue: "6 hours"
};

describe('Create/update/delete policie', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits - creating API definition via dashboard API', () => {
    const apiDefinition = newAPIdefinitionWithDefaults({"name":policyDetails.apiName});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });

  it('User should be able to create new Policy', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it('User should be able to edit created Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTimeUpdateValue);
    policies_page.NAME_INPUT.setValue(policyDetails.policyNameUpdate);
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it(`Changes should be displayed after reload. Key expiry: ${policyDetails.keyEpiryTimeUpdateValue}`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyNameUpdate);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.KEY_EXPIRY_AFTER_DROPDOWN.getText()).to.equal(policyDetails.keyEpiryTimeUpdateValue);
  });

  it('User should be able to delete policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyNameUpdate);
    policies_page.DELETE_BUTTON.click();
    policies_page.DELETE_CONFIRMATION_BUTTON.click();
    main_page.openPolicies();
    const wasPolicyDeleted = policies_page.POLICY_TABLE.isCellWithTextNotDisplayed(policyDetails.policyNameUpdate);
    expect(wasPolicyDeleted).to.be.true;
  });

});