import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import { catalogue_page } from '../../../lib/pom/Catalogue_page';

const authTokenApi = {
    "name": "api_catalogue",
    "use_keyless": false,
    "use_standard_auth": true,
};

const policyDetails = {
  apiName: 'api_catalogue',
  policyName: 'catalogue_policy',
  keyEpiryTime: "1 hour",
};

const catalogueDetails = {
    publicApiName: "Catalogue api",
    descriptionOfAPI: "QA automated test",
    catalogueOwnerAPI: "test2@gmail.com",
    customName:"test_name",
    customValue:"123",
    devRequestForm:"test_field",
};

const updatedCatalogueDetails = {
    publicApiName: "Catalogue_api_updated",
    descriptionOfAPI: "Updated description",
    catalogueOwnerAPI: "qa+test@gmail.com",
};
const NoCatalogueMessage = "No APIs registered for the portal.";

describe('Create/update/delete operations on Catalogue page', () => {
    const dashboard_connection = new Dashboard_connection();
    let envDetails;
  
before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    });
  
it('Prerequisits: creating API definition via dashboard API', () => {
    const body = newAPIdefinitionWithDefaults(authTokenApi);
    dashboard_connection.createAPI(body, envDetails.userSecret);
    });

it('User should be able to create new Policy', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
});

it('Confirmation popup should be displayed', () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

it('User should be able to add new API to Catalogue',()=>{
    main_page.openCatalogue();
    catalogue_page.ADD_NEW_API_BUTTON.click();
    catalogue_page.PUBLIC_API_NAME_INPUT.click();
    catalogue_page.PUBLIC_API_NAME_INPUT.setValue(catalogueDetails.publicApiName);
    catalogue_page.SELECT_POLICY_DROPDOWN.selectOption(policyDetails.policyName);
    catalogue_page.DESCRIBE_THIS_API_INPUT.click();
    catalogue_page.DESCRIBE_THIS_API_INPUT.setValue(catalogueDetails.descriptionOfAPI);
    catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.setValue(catalogueDetails.catalogueOwnerAPI);
    catalogue_page.FIELD_NAME_INPUT.setValue(catalogueDetails.customName);
    catalogue_page.FIELD_VALUE_INPUT.setValue(catalogueDetails.customValue);
    catalogue_page.ADD_BUTTON.click();
    catalogue_page.SETTINGS_TAB_BUTTON.click();
    catalogue_page.OVERRIDE_GLOBAL_SETTINGS.click();
    catalogue_page.REQUIRE_KEY_APPROVAL.click();
    catalogue_page.REDIRECT_KEY_REQUEST_CHECKBOX.click();
    catalogue_page.DEVELOPER_REQUEST_FORM_CUSTOMISATION.setValue(catalogueDetails.devRequestForm),
    catalogue_page.SAVE_BUTTON.click();
});

it('User should be able to modify Catalogue settings',()=>{
    catalogue_page.CATALOGUE_TABLE.clickCellWithText(catalogueDetails.publicApiName);
    wdioExpect(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(catalogueDetails.publicApiName);
    wdioExpect(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveText(catalogueDetails.descriptionOfAPI);
    wdioExpect(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(catalogueDetails.catalogueOwnerAPI);
    catalogue_page.PUBLIC_API_NAME_INPUT.setValue(updatedCatalogueDetails.publicApiName);
    catalogue_page.DESCRIBE_THIS_API_INPUT.click();
    catalogue_page.DESCRIBE_THIS_API_INPUT.setValue(updatedCatalogueDetails.descriptionOfAPI);
    catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.setValue(updatedCatalogueDetails.catalogueOwnerAPI);
    catalogue_page.SETTINGS_TAB_BUTTON.click();
    expect(catalogue_page.OVERRIDE_GLOBAL_SETTINGS.isSelected()).to.be.false;
    expect(catalogue_page.REQUIRE_KEY_APPROVAL.isSelected()).to.be.false;
    catalogue_page.UPDATE_BUTTON.click();
    catalogue_page.API_DETAILS_TAB.click();
    wdioExpect(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(updatedCatalogueDetails.publicApiName);
    wdioExpect(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveValue(updatedCatalogueDetails.descriptionOfAPI);
    wdioExpect(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(updatedCatalogueDetails.catalogueOwnerAPI);
});

it ('User should be able to delete a catalogue',()=>{
    catalogue_page.DELETE_BUTTON.click();
    catalogue_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    wdioExpect(catalogue_page.NO_APIS_REGISTERED_MESSAGE).toHaveText(NoCatalogueMessage);
});


});

