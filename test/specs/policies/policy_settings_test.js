/*
https://tykio.ontestpad.com/script/35#3//
Create policy with 
- Access denied + 1 week
- Draft + never expire
- Active + 6 hours
All policies can be reloaded with proper values
*/

import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const testApiDetails = {
  apiName: 'test_api'
};

const deniedPolicyDetails = {
  policyName: 'denied_policy',
  keyEpiryTime: "1 week",
  policyState: "Access Denied"
};

const draftPolicyDetails = {
  policyName: 'draft_policy',
  keyEpiryTime: "Key never expire",
  policyState: "Draft"
};

const activePolicyDetails = {
  policyName: 'active_policy',
  keyEpiryTime: "6 hours",
  policyState: "Active"
};

describe('Create policy page - settings tests', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API definition via dashboard API', () => {
    const apiDefinition = newAPIdefinitionWithDefaults({"name" : "test_api"});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });

  it('User should be able to create policy with Access Denied status', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(deniedPolicyDetails.policyName);
    policies_page.POLICY_STATE_DROPDOWN.selectOption(deniedPolicyDetails.policyState);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(deniedPolicyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it('Policy settings should be persistent after page reload', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(deniedPolicyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.POLICY_STATE_DROPDOWN.getText()).to.equal(deniedPolicyDetails.policyState);
    expect(policies_page.KEY_EXPIRY_AFTER_DROPDOWN.getText()).to.equal(deniedPolicyDetails.keyEpiryTime);
  });

  it('User should be able to create policy with Draft status', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(draftPolicyDetails.policyName);
    policies_page.POLICY_STATE_DROPDOWN.selectOption(draftPolicyDetails.policyState);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(draftPolicyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it('Policy settings should be persistent after page reload', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(draftPolicyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.POLICY_STATE_DROPDOWN.getText()).to.equal(draftPolicyDetails.policyState);
    expect(policies_page.KEY_EXPIRY_AFTER_DROPDOWN.getText()).to.equal(draftPolicyDetails.keyEpiryTime);
  });

  it('User should be able to create policy with Active status', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(activePolicyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(activePolicyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it('Policy settings should be persistent after page reload', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(activePolicyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.POLICY_STATE_DROPDOWN.getText()).to.equal(activePolicyDetails.policyState);
    expect(policies_page.KEY_EXPIRY_AFTER_DROPDOWN.getText()).to.equal(activePolicyDetails.keyEpiryTime);
  });

});