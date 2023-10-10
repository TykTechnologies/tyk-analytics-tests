import { test, assert } from '@fixtures';
import { config } from '@variables';
import { Locator } from '@playwright/test';  


test('CRUD basic Federation API', async ({ main_page, apis_page, graphql_page, page }) => {
  test.setTimeout(180000);
  const apiDetails = {
    supergraphName: "Super-test",
    usersSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4001/query`,
    usersSubgraphName: "Users-test",
    productsSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4002/query`,
    productsSubgraphName: "Products-test",
    reviewsSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4003/query`,
    reviewsSubgraphName: "Reviews-test"
  };
  let $supergraphTableElement: Locator;
  let $usersTableElement: Locator;
  let $productsTableElement: Locator;
  let $reviewsTableElement: Locator;

  await test.step('User should be able to create new Federation Subgraph API', async () => {
    await main_page.openAPIs();
    await apis_page.DESIGN_API_BOX.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.usersSubgraphName);
    await apis_page.API_TYPE_FEDERATION_BUTTON.click();
    await apis_page.API_TYPE_SUBGRAPH_BUTTON.first().click();
    await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.usersSubgraphUrl);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await assert(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toBeVisible({ timeout: 15000 });
    await apis_page.SAVE_BUTTON.click();
  });

  await test.step('New Federation Subgraph API should be visible in table', async () => {
    await main_page.openAPIs();
    $usersTableElement = page.locator(`span:text("${apiDetails.usersSubgraphName}")`);
    await assert($usersTableElement).toBeVisible();
  });

  await test.step('User should be able to update Federation Subgraph API', async () => {
    await $usersTableElement.click();
    await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
    await assert(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
    await apis_page.UPDATE_BUTTON.click();
    await apis_page.UPDATE_API_BUTTON.click();
    await assert(apis_page.API_UPDATED_MESSAGE).toBeVisible();
    await main_page.openAPIs();
    await $usersTableElement.click();
    await assert(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
  });

  await test.step('User should be able to create additional Subgraph APIs', async () => {
    //Products subgraph
    await main_page.openAPIs();
    await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.productsSubgraphName);
    await apis_page.API_TYPE_FEDERATION_BUTTON.click();
    await apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
    await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.productsSubgraphUrl);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await assert(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toBeVisible();
    await apis_page.SAVE_BUTTON.click();
    //Reviews subgraph
    await main_page.openAPIs();
    await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.reviewsSubgraphName);
    await apis_page.API_TYPE_FEDERATION_BUTTON.click();
    await apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
    await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.reviewsSubgraphUrl);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await assert(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toBeVisible();
    await apis_page.SAVE_BUTTON.click();
  });

  await test.step('Additional Federation Subgraph APIs should be visible in table', async () => {
    await main_page.openAPIs();
    $productsTableElement = page.locator(`span:text("${apiDetails.productsSubgraphName}")`);
    await assert($productsTableElement).toBeVisible();
    $reviewsTableElement = page.locator(`span:text("${apiDetails.reviewsSubgraphName}")`);
    await assert($reviewsTableElement).toBeVisible();
  });

  await test.step('User should be able to create a Federation Supergraph API ', async () => {
    await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.supergraphName);
    await apis_page.API_TYPE_FEDERATION_BUTTON.click();
    await apis_page.API_TYPE_SUPERGRAPH_BUTTON.click();
    await graphql_page.GRAPHQL_SUBGRAPHS_DROPDOWN.selectOptions([apiDetails.usersSubgraphName, apiDetails.productsSubgraphName, apiDetails.reviewsSubgraphName]);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await assert(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toBeVisible();
    await apis_page.SAVE_BUTTON.click();
  });

  await test.step('New Federation Supergraph API should be visible in table', async () => {
    await main_page.openAPIs();
    $supergraphTableElement = page.locator(`span:text("${apiDetails.supergraphName}")`);
    await assert($supergraphTableElement).toBeVisible();
  });

  await test.step('User should be able to update Federation Supergraph API', async () => {
    await $supergraphTableElement.click();
    await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
    await assert(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
    await apis_page.UPDATE_BUTTON.click();
    await apis_page.UPDATE_API_BUTTON.click();
    await assert(apis_page.API_UPDATED_MESSAGE).toBeVisible();
    await main_page.openAPIs();
    await $supergraphTableElement.click();
    await assert(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
  });

  await test.step('User should be able to delete Federation APIs', async () => {
    //Supergraph
    await main_page.openAPIs();
    await $supergraphTableElement.click();
    await apis_page.OPTIONS_BUTTON.click();
    await apis_page.DELETE_BUTTON.click();
    await apis_page.DELETE_API_BUTTON.click();
    await assert(apis_page.API_DELETED_MESSAGE).toBeVisible();
    //Users subgraph
    await main_page.openAPIs();
    await $usersTableElement.click();
    await apis_page.OPTIONS_BUTTON.click();
    await apis_page.DELETE_BUTTON.click();
    await apis_page.DELETE_API_BUTTON.click();
    await assert(apis_page.API_DELETED_MESSAGE).toBeVisible();
    //Products subgraph
    await main_page.openAPIs();
    await $productsTableElement.click();
    await apis_page.OPTIONS_BUTTON.click();
    await apis_page.DELETE_BUTTON.click();
    await apis_page.DELETE_API_BUTTON.click();
    await assert(apis_page.API_DELETED_MESSAGE).toBeVisible();
    //Reviews subgraph
    await main_page.openAPIs();
    await $reviewsTableElement.click();
    await apis_page.OPTIONS_BUTTON.click();
    await apis_page.DELETE_BUTTON.click();
    await apis_page.DELETE_API_BUTTON.click();
    await assert(apis_page.API_DELETED_MESSAGE).toBeVisible();
  });

  await test.step('Deleted APIs should not be visible', async () => {
    await assert($supergraphTableElement).not.toBeVisible();
    await assert($usersTableElement).not.toBeVisible();
    await assert($productsTableElement).not.toBeVisible();
    await assert($reviewsTableElement).not.toBeVisible();
  });

});
