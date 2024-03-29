import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const policyDetails = {
  policyName: 'multiple_apis',
  keyExpiryTime: "1 hour",
};

const basicAuthApisDetails = [
  {
    "name": "basic_auth_1",
    "use_basic_auth": true,
    "use_keyless": false
  },
  {
    "name": "basic_auth_2",
    "use_basic_auth": true,
    "use_keyless": false
  },
  {
    "name": "basic_auth_3",
    "use_basic_auth": true,
    "use_keyless": false
  },
];

const authTokenApiDetails = [
  {
    "name": "open_1",
    "use_keyless": false,

  }
];

test('Multiple APIs policies', async ({ createUserAndLogin, main_page, policies_page, page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definitions via dashboard API', async () => {
    const allApis = [...authTokenApiDetails, ...basicAuthApisDetails];
    console.log(`>> Creating ${allApis.length} API definitions`);
    for (const api of allApis) {
      const apiDefinition = newAPIdefinitionWithDefaults(api);
      await dashboard_connection.createAPI(apiDefinition, createUserAndLogin.userSecret);
    }
  });

  await test.step('User should be able to create new Policy with multiple APIs', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[0].name);
    await policies_page.API_TABLE.waitFor(); //waiting for table to be hidden
    await policies_page.API_SECTION_HEADER.click(); //opening section with API table
    await policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[1].name);
    await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await policies_page.NAME_INPUT.fill(policyDetails.policyName);
    await page.waitForTimeout(1000);
    await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyExpiryTime);
    await policies_page.CREATE_POLICY_BUTTON.click();
    await policies_page.checkIfSuccessPopupDisplayedWithText(policies_page.policy_created_expected_mesage);
  });

  await test.step(`User can't add policy with different Authorization type to policy`, async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    await policies_page.API_SECTION_HEADER.click(); //opening section with API table
    const isOpenAPnotAvailable = policies_page.API_TABLE.isCellWithTextNotDisplayed(authTokenApiDetails[0].name);
    assert(isOpenAPnotAvailable).toBeTruthy();
  });

  await test.step('User should be able to add API with tha same Authorization type to policy', async () => {
    await policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[2].name);
    await policies_page.UPDATE_POLICY_BUTTON.click();
    await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('User should be able to see all APIs assigned to policy', async () => {
    await main_page.openPolicies();
    await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    const apisObjects = page.locator('.policy-api__api-name');
    await apisObjects.first().waitFor();
    assert(await apisObjects.count()).toEqual(3);
    for (const api of basicAuthApisDetails) {
      await assert(page.locator(`span:text("${api.name}")`)).toBeVisible();
    }
  });

  await test.step('User should be able to delete API access from policy', async () => {
    await page.locator(`span:text("${basicAuthApisDetails[1].name}")`).click();
    const $removeAPIButton = page.locator(`span:text("${basicAuthApisDetails[1].name}")`).locator('../..').locator(`span:text("Remove Access")`);
    await $removeAPIButton.click();
    await policies_page.CONFIRM_BUTTON.click();
    assert(await page.locator('.policy-api__api-name').count()).toEqual(2);
  });
});