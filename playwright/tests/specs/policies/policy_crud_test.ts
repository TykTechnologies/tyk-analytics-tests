import { test, assert } from '@fixtures';

import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_policy',
  policyName: 'policy_auto_test_1',
  policyNameUpdate: 'policy_auto_test_1_update',
  keyEpiryTime: "1 hour",
  keyEpiryTimeUpdateValue: "6 hours"
};

test('Create/update/delete policies', async ({ createUserAndLogin, main_page }) => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const apiDefinition = newAPIdefinitionWithDefaults({"name":policyDetails.apiName});
    await dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });

  await test.step('User should be able to create new Policy', async () => {
    await main_page.openPolicies();
   await policies_page.ADD_POLICY_BUTTON.click();
   await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
   await policies_page.NAME_INPUT.fill(policyDetails.policyName);
   await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
   await policies_page.CREATE_POLICY_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    assert(policies_page.isPolicyCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to edit created Policy', async () => {
    await main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
   await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTimeUpdateValue);
   await policies_page.NAME_INPUT.fill(policyDetails.policyNameUpdate);
   await policies_page.UPDATE_POLICY_BUTTON.click();
   await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it(`Changes should be displayed after reload. Key expiry: ${policyDetails.keyEpiryTimeUpdateValue}`, () => {
    await main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyNameUpdate);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    assert(policies_page.KEY_EXPIRY_AFTER_DROPDOWN.getText()).to.equal(policyDetails.keyEpiryTimeUpdateValue);
  });

  await test.step('User should be able to delete policy', async () => {
    await main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyNameUpdate);
   await policies_page.DELETE_BUTTON.click();
   await policies_page.DELETE_CONFIRMATION_BUTTON.click();
    await main_page.openPolicies();
    const wasPolicyDeleted = policies_page.POLICY_TABLE.isCellWithTextNotDisplayed(policyDetails.policyNameUpdate);
    assert(wasPolicyDeleted).toBeTruthy();
  });

});