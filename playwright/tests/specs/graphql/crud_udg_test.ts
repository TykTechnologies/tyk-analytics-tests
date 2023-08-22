import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';

import { expect } from 'chai';

test('CRUD simple UDG API', async ({ createUserAndLogin, main_page }) => {
    const apiDetails = {
        name: "UDG-test"
    };
    let $apiTableElement;

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    await test.step('User should be able to create new UDG API', async () => {
        main_page.openAPIs();
       await apis_page.DESIGN_API_BOX.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.name);
       await apis_page.API_TYPE_UDG_BUTTON.click();
       await apis_page.CONFIGURE_API_BUTTON.click();
       await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        wdioExpect(graphql_page.UDG_IMPORT_SCHEMA_FILE_FIELD).toExist();
       await apis_page.SAVE_BUTTON.click();
    });
    
    await test.step('New UDG API should be visible in table', async () => {
        main_page.openAPIs();
        $apiTableElement = $(`span=${apiDetails.name}`);
        wdioExpect($apiTableElement).toBeClickable();
    });

    await test.step('User should be able to update UDG API', async () => {
        $apiTableElement.click();
       await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        expect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
       await apis_page.UPDATE_BUTTON.click();
       await apis_page.UPDATE_API_BUTTON.click();
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $apiTableElement.click();
        expect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
    });

    await test.step('User should be able to delete UDG API', async () => {
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
    });

    await test.step('Deleted API should not be visible', async () => {
        wdioExpect($apiTableElement).not.toBeDisplayed();
    });
});