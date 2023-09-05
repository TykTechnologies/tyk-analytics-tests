import { test, assert } from '@fixtures';
import { Locator } from '@playwright/test';

test('Create simple API', async ({ createUserAndLogin, main_page, apis_page, page }) => {
  const apiDetails = {
    name: "test"
  };
  let $apiTableElement: Locator;

  await test.step('User should be able to create new API', async () => {
    await main_page.openAPIs();
    await apis_page.DESIGN_API_BOX.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.name);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await apis_page.SAVE_BUTTON.click();
  });

  await test.step('New API should be visible in table', async () => {
    await main_page.openAPIs();
    $apiTableElement = page.locator(`span:text("${apiDetails.name}")`);
    await assert($apiTableElement).toBeVisible();
  });

  await test.step('User should be able to delete API', async () => {
    await $apiTableElement.click();
    await apis_page.OPTIONS_BUTTON.click();
    await apis_page.DELETE_BUTTON.click();
    await apis_page.DELETE_API_BUTTON.click();
  });

  await test.step('Deleted API should not be visible', async () => {
    await assert($apiTableElement).not.toBeVisible();
  });
});