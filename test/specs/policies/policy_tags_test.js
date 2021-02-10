import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
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

  it('User should be able to create new Policy with tag', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    policies_page.MAIN_TAG_INPUT.setValue(policyDetails.tagName);
    policies_page.TAG_ADD_BUTTON.click();
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it(`Tag: ${policyDetails.tagName} should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.TAG_LABEL.getText()).to.equal(policyDetails.tagName);
  });

  it('User should be able to edit tag on Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.TAG_EDIT_BUTTON.click();
    policies_page.TAG_INPUT.setValue(policyDetails.updatedTagName);
    policies_page.TAG_UPDATE_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });

  it(`Updated tag: ${policyDetails.updatedTagName} should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    expect(policies_page.TAG_LABEL.getText()).to.equal(policyDetails.updatedTagName);
  });

  it('User should be able to delete tag from policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.TAG_DELETE_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to add multiple tags on Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.MAIN_TAG_INPUT.setValue(policyDetails.tagName);
    policies_page.TAG_ADD_BUTTON.click();
    policies_page.MAIN_TAG_INPUT.setValue(policyDetails.updatedTagName);
    policies_page.TAG_ADD_BUTTON.click();
    policies_page.MAIN_TAG_INPUT.setValue(policyDetails.anotherTagName);
    policies_page.TAG_ADD_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it(`Three tags should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.TAG_ELEMENTS).toHaveChildren({ gte: 3 });
  });

});