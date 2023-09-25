import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';

import { expect } from 'chai';

test('CRUD simple GraphQL (proxy-only) API', async ({ createUserAndLogin, main_page }) => {
    const apiDetails = {
        name: "GraphQL-test"
    };
    let $apiTableElement;

    await test.step('User should be able to create new GraphQL API', async () => {
        await main_page.openAPIs();
       await apis_page.DESIGN_API_BOX.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.name);
       await apis_page.API_TYPE_GRAPHQL_BUTTON.click();
       await apis_page.CONFIGURE_API_BUTTON.click();
       await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        await assert(graphql_page.GRAPHQL_UPDATE_SCHEMA_BUTTON).toBeVisible();
       await apis_page.SAVE_BUTTON.click();
    });
    
    await test.step('New GraphQL API should be visible in table', async () => {
        await main_page.openAPIs();
        $apiTableElement = await this.page.locator(`span:text("${apiDetails.name}")`);
        await assert($apiTableElement).toBeVisible();
    });

    await test.step('User should be able to update GraphQL API', async () => {
      await $apiTableElement.click();
       await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        assert(await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).toBeTruthy();
       await apis_page.UPDATE_BUTTON.click();
       await apis_page.UPDATE_API_BUTTON.click();        
        await assert(apis_page.API_UPDATED_MESSAGE).toBeVisible();
        await main_page.openAPIs();
      await $apiTableElement.click();
        assert(await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).toBeTruthy();
    });

    await test.step('User should be able to delete GraphQL API', async () => {
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
        await assert(apis_page.API_DELETED_MESSAGE).toBeVisible();
    });

    await test.step('Deleted API should not be visible', async () => {
        await assert($apiTableElement).not.toBeVisible();
    });
});