import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_metadata',
  keyEpiryTime: "1 hour",
};

test('Create/update/delete metadata on policy', async ({ createUserAndLogin, main_page, policies_page, page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const apiDefinition = newAPIdefinitionWithDefaults({ "name": policyDetails.apiName });
    await dashboard_connection.createAPI(apiDefinition, createUserAndLogin.userSecret);
  });

  await test.step('User should be able to create new Policy with metadata', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(policyDetails.policyName);
    await page.waitForTimeout(500);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    await policies_page.MAIN_METADATA_KEY_INPUT.fill("meta-key-1");
    await policies_page.MAIN_METADATA_VALUE_INPUT.fill("meta-value-1");
    await policies_page.METADATA_ADD_BUTTON.click();
    await policies_page.CREATE_POLICY_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    assert(policies_page.checkIfPolicyCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step(`Metadata should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.METADATA_TABLE).toContainText('meta-key-1');
    await assert(policies_page.METADATA_TABLE).toContainText('meta-value-1');

  });

  await test.step('User should be able to edit metadata on Policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.METADATA_EDIT_BUTTON.click();
    await policies_page.METADATA_KEY_INPUT.fill("meta-key-2");
    await policies_page.METADATA_VALUE_INPUT.fill("meta-value-2");
    await policies_page.METADATA_UPDATE_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    assert(policies_page.checkIfPolicyUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step(`Updated metadata should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.METADATA_TABLE).toContainText('meta-key-2');
    await assert(policies_page.METADATA_TABLE).toContainText('meta-value-2');
  });

  await test.step('User should be able to delete metadata from policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.METADATA_DELETE_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    await policies_page.checkIfPolicyUpdatedPopUpDisplayed();
  });

  await test.step(`No metadata should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.METADATA_TABLE).not.toBeVisible();
  });

  await test.step('User should be able to add multiple metadata on Policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.MAIN_METADATA_KEY_INPUT.fill("meta-key-1");
    await policies_page.MAIN_METADATA_VALUE_INPUT.fill("meta-value-1");
    await policies_page.METADATA_ADD_BUTTON.click();
    await policies_page.MAIN_METADATA_KEY_INPUT.fill("meta-key-2");
    await policies_page.MAIN_METADATA_VALUE_INPUT.fill("meta-value-2");
    await policies_page.METADATA_ADD_BUTTON.click();
    await policies_page.MAIN_METADATA_KEY_INPUT.fill("meta-key-3");
    await policies_page.MAIN_METADATA_VALUE_INPUT.fill("meta-value-3");
    await policies_page.METADATA_ADD_BUTTON.click();
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step(`Three medatada should be displayed after policy reload`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.METADATA_TABLE.locator('li')).toHaveCount(3);
  });

});