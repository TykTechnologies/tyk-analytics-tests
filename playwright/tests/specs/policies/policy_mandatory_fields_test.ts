import { test, assert } from '@fixtures';

import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_mandatory_fields',
  keyEpiryTime: "1 hour"
};

test('Create/update/delete tags on policy', async ({ createUserAndLogin, main_page }) => {
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

  await test.step('User should see error message on Access Rights tab if no API was selected', async () => {
    await main_page.openPolicies();
   await policies_page.ADD_POLICY_BUTTON.click();
   await policies_page.CREATE_POLICY_BUTTON.click();
    await assert(policies_page.API_ERROR_ICON).toBeDisplayed();
    await assert(policies_page.CONFIG_ERROR_ICON).toBeDisplayed();
    await assert(policies_page.API_MANDATORY_TEXT).toBeDisplayed();
  });

  await test.step('User should not see errors on Access Rights tab if 1 API was selected', async () => {
   await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    await assert(policies_page.API_ERROR_ICON).not.toBeDisplayed();
    await assert(policies_page.API_MANDATORY_TEXT).not.toBeDisplayed();
    await assert(policies_page.CONFIG_ERROR_ICON).toBeDisplayed();
  });

  await test.step('User should see errors on Configurations tab - Name and Expiry missing', async () => {
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(policies_page.NAME_MANDATORY_TEXT).toBeDisplayed();
    await assert(policies_page.EXPIRY_MANDATORY_TEXT).toBeDisplayed();
  });

  await test.step('User should be able to save Policy onces all mandatory fields are entered', async () => {
   await policies_page.NAME_INPUT.fill(policyDetails.policyName);
   await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    await assert(policies_page.CONFIG_ERROR_ICON).not.toBeDisplayed();
    await assert(policies_page.NAME_MANDATORY_TEXT).not.toBeDisplayed();
    await assert(policies_page.EXPIRY_MANDATORY_TEXT).not.toBeDisplayed();
   await policies_page.CREATE_POLICY_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    assert(policies_page.isPolicyCreatedPopUpDisplayed()).toBeTruthy();
  });

});