import { test, assert } from '@fixtures';

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

test('Create/update/delete operations on Catalogue page', async ({ createUserAndLogin, main_page }) => {
    const dashboard_connection = new Dashboard_connection();
    let envDetails;
  
before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    });
  
await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const body = newAPIdefinitionWithDefaults(authTokenApi);
    dashboard_connection.createAPI(body, envDetails.userSecret);
    });

await test.step('User should be able to create new Policy', async () => {
    main_page.openPolicies();
   await policies_page.ADD_POLICY_BUTTON.click();
   await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
   await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
   await policies_page.NAME_INPUT.fill(policyDetails.policyName);
   await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
   await policies_page.CREATE_POLICY_BUTTON.click();
});

await test.step('Confirmation popup should be displayed', async () => {
    expect(policies_page.isPolicyCreatedPopUpDisplayed()).to.be.true;
  });

it('User should be able to add new API to Catalogue',()=>{
    main_page.openCatalogue();
   await catalogue_page.ADD_NEW_API_BUTTON.click();
   await catalogue_page.PUBLIC_API_NAME_INPUT.click();
   await catalogue_page.PUBLIC_API_NAME_INPUT.fill(catalogueDetails.publicApiName);
   await catalogue_page.SELECT_POLICY_DROPDOWN.selectOption(policyDetails.policyName);
    catalogue_page.DESCRIBE_awaitawait this.API_INPUT.click();
    catalogue_page.DESCRIBE_await this.API_INPUT.fill(catalogueDetails.descriptionOfAPI);
   await catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.fill(catalogueDetails.catalogueOwnerAPI);
   await catalogue_page.FIELD_NAME_INPUT.fill(catalogueDetails.customName);
   await catalogue_page.FIELD_VALUE_INPUT.fill(catalogueDetails.customValue);
   await catalogue_page.ADD_BUTTON.click();
   await catalogue_page.SETTINGS_TAB_BUTTON.click();
   await catalogue_page.OVERRIDE_GLOBAL_SETTINGS.click();
   await catalogue_page.REQUIRE_KEY_APPROVAL.click();
   await catalogue_page.REDIRECT_KEY_REQUEST_CHECKBOX.click();
    catalogue_page.DEVELOPER_REQUEST_FORM_CUSTOMISATION.setValue(catalogueDetails.devRequestForm),
   await catalogue_page.SAVE_BUTTON.click();
});

it('User should be able to modify Catalogue settings',()=>{
   await catalogue_page.CATALOGUE_TABLE.clickCellWithText(catalogueDetails.publicApiName);
    wdioExpect(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(catalogueDetails.publicApiName);
    wdioExpect(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveText(catalogueDetails.descriptionOfAPI);
    wdioExpect(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(catalogueDetails.catalogueOwnerAPI);
   await catalogue_page.PUBLIC_API_NAME_INPUT.fill(updatedCatalogueDetails.publicApiName);
    catalogue_page.DESCRIBE_awaitawait this.API_INPUT.click();
    catalogue_page.DESCRIBE_await this.API_INPUT.fill(updatedCatalogueDetails.descriptionOfAPI);
   await catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.fill(updatedCatalogueDetails.catalogueOwnerAPI);
   await catalogue_page.SETTINGS_TAB_BUTTON.click();
    expect(catalogue_page.OVERRIDE_GLOBAL_SETTINGS.isSelected()).to.be.false;
    expect(catalogue_page.REQUIRE_KEY_APPROVAL.isSelected()).to.be.false;
   await catalogue_page.UPDATE_BUTTON.click();
   await catalogue_page.API_DETAILS_TAB.click();
    wdioExpect(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(updatedCatalogueDetails.publicApiName);
    wdioExpect(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveValue(updatedCatalogueDetails.descriptionOfAPI);
    wdioExpect(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(updatedCatalogueDetails.catalogueOwnerAPI);
});

it ('User should be able to delete a catalogue',()=>{
   await catalogue_page.DELETE_BUTTON.click();
   await catalogue_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    wdioExpect(catalogue_page.NO_APIS_REGISTERED_MESSAGE).toHaveText(NoCatalogueMessage);
});


});

