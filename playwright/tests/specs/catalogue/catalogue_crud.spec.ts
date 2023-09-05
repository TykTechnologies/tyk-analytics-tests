import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

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
    customName: "test_name",
    customValue: "123",
    devRequestForm: "test_field",
};

const updatedCatalogueDetails = {
    publicApiName: "Catalogue_api_updated",
    descriptionOfAPI: "Updated description",
    catalogueOwnerAPI: "qa+test@gmail.com",
};
const NoCatalogueMessage = "No APIs registered for the portal.";

test('Create/update/delete operations on Catalogue page', async ({ createUserAndLogin, main_page, catalogue_page, policies_page, page }) => {
    const dashboard_connection = new Dashboard_connection();

    await test.step('Prerequisits: creating API definition via dashboard API', async () => {
        const body = newAPIdefinitionWithDefaults(authTokenApi);
        await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
    });

    await test.step('User should be able to create new Policy', async () => {
        await main_page.openPolicies();
        await policies_page.ADD_POLICY_BUTTON.click();
        await policies_page.API_TABLE.clickCellWithText(policyDetails.apiName);
        await policies_page.CONFIGURATIONS_TAB_BUTTON.click();
        await policies_page.NAME_INPUT.fill(policyDetails.policyName);
        await page.waitForTimeout(1000);
        await policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
        await policies_page.CREATE_POLICY_BUTTON.click();
    });

    await test.step('Confirmation popup should be displayed', async () => {
        await policies_page.checkIfPolicyCreatedPopUpDisplayed();
    });

    await test.step('User should be able to add new API to Catalogue', async () => {
        await main_page.openCatalogue();
        await catalogue_page.ADD_NEW_API_BUTTON.click();
        await catalogue_page.PUBLIC_API_NAME_INPUT.click();
        await catalogue_page.PUBLIC_API_NAME_INPUT.fill(catalogueDetails.publicApiName);
        await catalogue_page.SELECT_POLICY_DROPDOWN.selectOption(policyDetails.policyName);
        await catalogue_page.DESCRIBE_THIS_API_INPUT.click();
        await catalogue_page.DESCRIBE_THIS_API_INPUT.fill(catalogueDetails.descriptionOfAPI);
        await catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.fill(catalogueDetails.catalogueOwnerAPI);
        await catalogue_page.FIELD_NAME_INPUT.fill(catalogueDetails.customName);
        await catalogue_page.FIELD_VALUE_INPUT.fill(catalogueDetails.customValue);
        await catalogue_page.ADD_BUTTON.click();
        await catalogue_page.SETTINGS_TAB_BUTTON.click();
        await catalogue_page.OVERRIDE_GLOBAL_SETTINGS.click();
        await catalogue_page.REQUIRE_KEY_APPROVAL.click();
        await catalogue_page.REDIRECT_KEY_REQUEST_CHECKBOX.click();
        await catalogue_page.DEVELOPER_REQUEST_FORM_CUSTOMISATION.fill(catalogueDetails.devRequestForm),
        await catalogue_page.SAVE_BUTTON.click();
    });

    await test.step('User should be able to modify Catalogue settings', async () => {
        await catalogue_page.CATALOGUE_TABLE.clickCellWithText(catalogueDetails.publicApiName);
        await assert(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(catalogueDetails.publicApiName);
        await assert(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveText(catalogueDetails.descriptionOfAPI);
        await assert(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(catalogueDetails.catalogueOwnerAPI);
        await catalogue_page.PUBLIC_API_NAME_INPUT.fill(updatedCatalogueDetails.publicApiName);
        await catalogue_page.DESCRIBE_THIS_API_INPUT.click();
        await catalogue_page.DESCRIBE_THIS_API_INPUT.fill(updatedCatalogueDetails.descriptionOfAPI);
        await catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT.fill(updatedCatalogueDetails.catalogueOwnerAPI);
        await catalogue_page.SETTINGS_TAB_BUTTON.click();
        assert(await catalogue_page.OVERRIDE_GLOBAL_SETTINGS.isSelected()).toBeTruthy();
        assert(await catalogue_page.REQUIRE_KEY_APPROVAL.isSelected()).toBeTruthy();
        await catalogue_page.UPDATE_BUTTON.click();
        await catalogue_page.API_DETAILS_TAB.click();
        await assert(catalogue_page.PUBLIC_API_NAME_INPUT).toHaveValue(updatedCatalogueDetails.publicApiName);
        await assert(catalogue_page.DESCRIBE_THIS_API_INPUT).toHaveValue(updatedCatalogueDetails.descriptionOfAPI);
        await assert(catalogue_page.CATALOGUE_OWNER_EMAIL_INPUT).toHaveValue(updatedCatalogueDetails.catalogueOwnerAPI);
    });

    await test.step('User should be able to delete a catalogue', async () => {
        await catalogue_page.DELETE_BUTTON.click();
        await catalogue_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
        await assert(catalogue_page.NO_APIS_REGISTERED_MESSAGE).toHaveText(NoCatalogueMessage);
    });


});

