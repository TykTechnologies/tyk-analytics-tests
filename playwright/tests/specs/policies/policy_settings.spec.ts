/*
https://tykio.ontestpad.com/script/35#3//
Create policy with 
- Access denied + 1 week
- Draft + never expire
- Active + 6 hours
All policies can be reloaded with proper values
*/

import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

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

test('Create policy page - settings tests', async ({ createUserAndLogin, main_page, policies_page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const apiDefinition = newAPIdefinitionWithDefaults({ "name": "test_api" });
    await dashboard_connection.createAPI(apiDefinition, createUserAndLogin.userSecret);
  });

  await test.step('User should be able to create policy with Access Denied status', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(deniedPolicyDetails.policyName);
    await policies_page.POLICY_STATE_DROPDOWN.selectOption(deniedPolicyDetails.policyState);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(deniedPolicyDetails.keyEpiryTime);
    await policies_page.CREATE_POLICY_BUTTON.click();
    await policies_page.checkIfPolicyCreatedPopUpDisplayed();
  });

  await test.step('Policy settings should be persistent after page reload', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(deniedPolicyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.POLICY_STATE_DROPDOWN).toHaveText(deniedPolicyDetails.policyState);
    await assert(policies_page.KEY_EXPIRY_AFTER_DROPDOWN).toHaveText(deniedPolicyDetails.keyEpiryTime);
  });

  await test.step('User should be able to create policy with Draft status', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(draftPolicyDetails.policyName);
    await policies_page.POLICY_STATE_DROPDOWN.selectOption(draftPolicyDetails.policyState);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(draftPolicyDetails.keyEpiryTime);
    await policies_page.CREATE_POLICY_BUTTON.click();
    await policies_page.checkIfPolicyCreatedPopUpDisplayed();
  });

  await test.step('Policy settings should be persistent after page reload', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(draftPolicyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.POLICY_STATE_DROPDOWN).toHaveText(draftPolicyDetails.policyState);
    await assert(policies_page.KEY_EXPIRY_AFTER_DROPDOWN).toHaveText(draftPolicyDetails.keyEpiryTime);
  });

  await test.step('User should be able to create policy with Active status', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(testApiDetails.apiName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(activePolicyDetails.policyName);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(activePolicyDetails.keyEpiryTime);
    await policies_page.CREATE_POLICY_BUTTON.click();
    await policies_page.checkIfPolicyCreatedPopUpDisplayed();
  });

  await test.step('Policy settings should be persistent after page reload', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(activePolicyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.POLICY_STATE_DROPDOWN).toHaveText(activePolicyDetails.policyState);
    await assert(policies_page.KEY_EXPIRY_AFTER_DROPDOWN).toHaveText(activePolicyDetails.keyEpiryTime);
  });

});