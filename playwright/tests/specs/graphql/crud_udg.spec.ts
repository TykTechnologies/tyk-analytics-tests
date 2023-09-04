import { test, assert } from '@fixtures';
import { Locator } from '@playwright/test';

test('CRUD simple UDG API', async ({ createUserAndLogin, main_page, graphql_page, apis_page, page }) => {
    const apiDetails = {
        name: "UDG-test"
    };
    let $apiTableElement: Locator;

    await test.step('User should be able to create new UDG API', async () => {
        await main_page.openAPIs();
        await apis_page.DESIGN_API_BOX.click();
        await apis_page.API_NAME_INPUT.fill(apiDetails.name);
        await apis_page.API_TYPE_UDG_BUTTON.click();
        await apis_page.CONFIGURE_API_BUTTON.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        await assert(graphql_page.UDG_IMPORT_SCHEMA_FILE_FIELD).toBeVisible();
        await apis_page.SAVE_BUTTON.click();
    });

    await test.step('New UDG API should be visible in table', async () => {
        await main_page.openAPIs();
        $apiTableElement = page.locator(`span:text-is('${apiDetails.name}')`);
        await assert($apiTableElement).toBeVisible();
    });

    await test.step('User should be able to update UDG API', async () => {
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

    await test.step('User should be able to delete UDG API', async () => {
        await apis_page.OPTIONS_BUTTON.click();
        await apis_page.DELETE_BUTTON.click();
        await apis_page.DELETE_API_BUTTON.click();
    });

    await test.step('Deleted API should not be visible', async () => {
        await assert($apiTableElement).not.toBeVisible();
    });
});