import { test, assert } from '@fixtures';

import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_tag',
  tagName: 'original_tag',
  updatedTagName: 'updated_tag',
  anotherTagName: 'multi_works_fine',
  keyEpiryTime: "1 hour",
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
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });

  await test.step('User should be able to create new Policy with tag', async () => {
    main_page.openPolicies();
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
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it(`Tag: ${policyDetails.tagName} should be displayed after policy reload`, () => {
    main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.TAG_LABEL.getText()).to.equal(policyDetails.tagName);
  });

  await test.step('User should be able to edit tag on Policy', async () => {
    main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
   await policies_page.TAG_EDIT_BUTTON.click();
   await policies_page.TAG_INPUT.fill(policyDetails.updatedTagName);
   await policies_page.TAG_UPDATE_BUTTON.click();
   await policies_page.UPDATE_POLICY_BUTTON.click();
   await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });

  it(`Updated tag: ${policyDetails.updatedTagName} should be displayed after policy reload`, () => {
    main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.TAG_LABEL.getText()).to.equal(policyDetails.updatedTagName);
  });

  await test.step('User should be able to delete tag from policy', async () => {
    main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
   await policies_page.TAG_DELETE_BUTTON.click();
   await policies_page.UPDATE_POLICY_BUTTON.click();
   await policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  await test.step('Confirmation popup should be displayed', async () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });

  await test.step('User should be able to add multiple tags on Policy', async () => {
    main_page.openPolicies();
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

  it(`Three tags should be displayed after policy reload`, () => {
    main_page.openPolicies();
   await policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.TAG_ELEMENTS).toHaveChildren({ gte: 3 });
  });

});