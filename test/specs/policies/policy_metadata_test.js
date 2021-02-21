import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const policyDetails = {
  apiName: 'test_api',
  policyName: 'policy_metadata',
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

  it('User should be able to create new Policy with metadata', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    policies_page.MAIN_METADATA_KEY_INPUT.setValue("meta-key-1");
    policies_page.MAIN_METADATA_VALUE_INPUT.setValue("meta-value-1");
    policies_page.METADATA_ADD_BUTTON.click();
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it(`Metadata should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.METADATA_TABLE).toHaveTextContaining('meta-key-1');
    wdioExpect(policies_page.METADATA_TABLE).toHaveTextContaining('meta-value-1');
    
  });

  it('User should be able to edit metadata on Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.METADATA_EDIT_BUTTON.click();
    policies_page.METADATA_KEY_INPUT.setValue("meta-key-2");
    policies_page.METADATA_VALUE_INPUT.setValue("meta-value-2");
    policies_page.METADATA_UPDATE_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });

  it(`Updated metadata should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.METADATA_TABLE).toHaveTextContaining('meta-key-2');
    wdioExpect(policies_page.METADATA_TABLE).toHaveTextContaining('meta-value-2');
  });

  it('User should be able to delete metadata from policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.METADATA_DELETE_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyUpdatedPopUpDisplayed()).to.be.true;
  });
  
  it(`No metadata should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.METADATA_TABLE).not.toExist();
  });

  it('User should be able to add multiple metadata on Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.MAIN_METADATA_KEY_INPUT.setValue("meta-key-1");
    policies_page.MAIN_METADATA_VALUE_INPUT.setValue("meta-value-1");
    policies_page.METADATA_ADD_BUTTON.click();
    policies_page.MAIN_METADATA_KEY_INPUT.setValue("meta-key-2");
    policies_page.MAIN_METADATA_VALUE_INPUT.setValue("meta-value-2");
    policies_page.METADATA_ADD_BUTTON.click();
    policies_page.MAIN_METADATA_KEY_INPUT.setValue("meta-key-3");
    policies_page.MAIN_METADATA_VALUE_INPUT.setValue("meta-value-3");
    policies_page.METADATA_ADD_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it(`Three medatada should be displayed after policy reload`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(policies_page.METADATA_TABLE).toHaveChildren({ gte: 3 });
  });

});