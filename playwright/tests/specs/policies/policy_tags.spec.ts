import { test, assert } from '@fixtures';

import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_tag',
  tagName: 'original_tag',
  updatedTagName: 'updated_tag',
  anotherTagName: 'multi_works_fine',
  keyEpiryTime: "1 hour",
};

test('Create/update/delete tags on policy', async ({ createUserAndLogin, main_page, policies_page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const apiDefinition = newAPIdefinitionWithDefaults({ "name": policyDetails.apiName });
    await dashboard_connection.createAPI(apiDefinition, createUserAndLogin.userSecret);
  });

  await test.step('User should be able to create new Policy with tag', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(policyDetails.policyName);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    await policies_page.MAIN_TAG_INPUT.fill(policyDetails.tagName);
    await policies_page.TAG_ADD_BUTTON.click();
    await policies_page.CREATE_POLICY_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    await policies_page.checkIfPolicyCreatedPopUpDisplayed();
  });

  await test.step(`Tag: ${policyDetails.tagName} should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.TAG_LABEL).toHaveText(policyDetails.tagName);
  });

  await test.step('User should be able to edit tag on Policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.TAG_EDIT_BUTTON.click();
    await policies_page.TAG_INPUT.fill(policyDetails.updatedTagName);
    await policies_page.TAG_UPDATE_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    await policies_page.checkIfPolicyUpdatedPopUpDisplayed();
  });

  await test.step(`Updated tag: ${policyDetails.updatedTagName} should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.TAG_LABEL).toHaveText(policyDetails.updatedTagName);
  });

  await test.step('User should be able to delete tag from policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.TAG_DELETE_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    await policies_page.checkIfPolicyUpdatedPopUpDisplayed();
  });

  await test.step('User should be able to add multiple tags on Policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.MAIN_TAG_INPUT.fill(policyDetails.tagName);
    await policies_page.TAG_ADD_BUTTON.click();
    await policies_page.MAIN_TAG_INPUT.fill(policyDetails.updatedTagName);
    await policies_page.TAG_ADD_BUTTON.click();
    await policies_page.MAIN_TAG_INPUT.fill(policyDetails.anotherTagName);
    await policies_page.TAG_ADD_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step(`Three tags should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.TAG_ELEMENTS.locator('li')).toHaveCount(3);
  });

});