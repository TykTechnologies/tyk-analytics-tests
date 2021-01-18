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
    policies_page.TAG_INPUT.setValue(policyDetails.tagName);
    policies_page.ADD_TAG_BUTTON.click();
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to edit tag on created Policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.EDIT_TAG_BUTTON.click();
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it(`Changes should be displayed after reload. Key expiry: ${policyDetails.keyEpiryTimeUpdateValue}`, () => {
    main_page.openPolicies();
    
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    
  });

  it('User should be able to delete tag from policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.DELETE_TAG_BUTTON.click();
    
    main_page.openPolicies();
    
  });

});