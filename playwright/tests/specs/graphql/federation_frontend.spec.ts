import { test, assert } from '@fixtures';
import { expect } from '@playwright/test';

import { config } from '@variables';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

test('Federation API frontend', async ({ createUserAndLogin, main_page, apis_page, graphql_page, page }) => {
  const apiDetails = {
    supergraphName: "Super-test",
    usersSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4001/query`,
    usersSubgraphName: "Users-test",
    productsSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4002/query`,
    productsSubgraphName: "Products-test",
    reviewsSubgraphUrl: `http://${config.FEDERATION_UPSTREAM_HOST}:4003/query`,
    reviewsSubgraphName: "Reviews-test"
  };

  const usersSubgraphApi = {
    "name": `${apiDetails.usersSubgraphName}`,
    "graphql": {
      "enabled": true,
      "execution_mode": "subgraph",
      "schema": "directive @external on FIELD_DEFINITION\n\ndirective @requires(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @provides(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @key(fields: _FieldSet!) on OBJECT | INTERFACE\n\ndirective @extends on OBJECT\n\nscalar _Any\n\ntype _Service {\n  sdl: String\n}\n\nunion _Entity = User\n\ntype User {\n  id: ID!\n  username: String!\n}\n\ntype Entity {\n  findUserByID(id: ID!): User!\n}\n\ntype Query {\n  me: User\n  _entities(representations: [_Any!]!): [_Entity]!\n  _service: _Service!\n}\n\nscalar _FieldSet",
      "subgraph": {
        "sdl": "extend type Query {\n    me: User\n}\n\ntype User @key(fields: \"id\") {\n    id: ID!\n    username: String!\n}\n"
      },
      "version": "2"
    },
    "internal": true,
    "proxy": {
      "target_url": `${apiDetails.usersSubgraphUrl}`
    }
  };

  const usersVerificationArray = [
    ['extend', 'type', 'Query'],
    ['me', 'User'],
    [], [],
    ['type', 'User', '@key', 'fields', '"id"'],
    ['id', 'ID'],
    ['username', 'String']
  ];

  const usersSchemaEditorXpath = '//div[@class="supergraph-panels"]//h3[text()="Users-test"]//following-sibling::div[@class="collapse-wrapper collapse-enter-done"]//div[@class="view-lines monaco-mouse-cursor-text"]';

  const productsSubgraphApi = {
    "name": `${apiDetails.productsSubgraphName}`,
    "graphql": {
      "enabled": true,
      "execution_mode": "subgraph",
      "schema": "directive @requires(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @provides(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @key(fields: _FieldSet!) on OBJECT | INTERFACE\n\ndirective @extends on OBJECT\n\ndirective @external on FIELD_DEFINITION\n\ntype Entity {\n  findProductByUpc(upc: String!): Product!\n}\n\nscalar _FieldSet\n\ntype Query {\n  topProducts(first: Int = 5): [Product]\n  _entities(representations: [_Any!]!): [_Entity]!\n  _service: _Service!\n}\n\nscalar _Any\n\ntype _Service {\n  sdl: String\n}\n\ntype Subscription {\n  updatedPrice: Product!\n  updateProductPrice(upc: String!): Product!\n  stock: [Product!]\n}\n\ntype Product {\n  upc: String!\n  name: String!\n  price: Int!\n  inStock: Int!\n}\n\nunion _Entity = Product",
      "subgraph": {
        "sdl": "extend type Query {\n    topProducts(first: Int = 5): [Product]\n}\n\nextend type Subscription {\n    updatedPrice: Product!\n    updateProductPrice(upc: String!): Product!\n    stock: [Product!]\n}\n\ntype Product @key(fields: \"upc\") {\n    upc: String!\n    name: String!\n    price: Int!\n    inStock: Int!\n}"
      },
      "version": "2"
    },
    "internal": true,
    "proxy": {
      "target_url": `${apiDetails.productsSubgraphUrl}`
    }
  };

  const reviewsSubgraphApi = {
    "name": `${apiDetails.reviewsSubgraphName}`,
    "graphql": {
      "enabled": true,
      "execution_mode": "subgraph",
      "schema": "directive @external on FIELD_DEFINITION\n\ndirective @requires(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @provides(fields: _FieldSet!) on FIELD_DEFINITION\n\ndirective @key(fields: _FieldSet!) on OBJECT | INTERFACE\n\ndirective @extends on OBJECT\n\nscalar _FieldSet\n\ntype Entity {\n  findProductByUpc(upc: String!): Product!\n  findUserByID(id: ID!): User!\n}\n\nscalar _Any\n\ntype User {\n  id: ID!\n  username: String!\n  reviews: [Review]\n}\n\ntype Product {\n  upc: String!\n  reviews: [Review]\n}\n\ntype Query {\n  _entities(representations: [_Any!]!): [_Entity]!\n  _service: _Service!\n}\n\ntype _Service {\n  sdl: String\n}\n\ntype Review {\n  body: String!\n  author: User!\n  product: Product!\n}\n\nunion _Entity = Product | User",
      "subgraph": {
        "sdl": "type Review {\n    body: String!\n    author: User! @provides(fields: \"username\")\n    product: Product!\n}\n\nextend type User @key(fields: \"id\") {\n    id: ID! @external\n    username: String! @external\n    reviews: [Review]\n}\n\nextend type Product @key(fields: \"upc\") {\n    upc: String! @external\n    reviews: [Review]\n}\n"
      },
      "version": "2"
    },
    "internal": true,
    "proxy": {
      "target_url": `${apiDetails.reviewsSubgraphUrl}`
    }
  };

  const supergraphVerificationArray = [
    ["type", "Query"],
    ["me", "User"],
    ["topProducts", "first", "Int", "5", "Product"],
    [], [],
    ["type", "Subscription"],
    ["updatedPrice", "Product"],
    ["updateProductPrice", "upc", "String", "Product"],
    ["stock", "Product"],
    [], [],
    ["type", "User"],
    ["id", "ID"],
    ["username", "String"],
    [], [],
    ["type", "Product"],
    ["upc", "String"],
    ["name", "String"],
    ["price", "Int"],
    ["inStock", "Int"]
  ];

  const supergraphSchemaEditorXpath = '//div[@id="graphql-schema"]//div[@class="view-lines monaco-mouse-cursor-text"]';
  const dashboard_connection = new Dashboard_connection();
  let $supergraphTableElement;
  const refreshCounter = 0;

  await test.step('Prerequisites: creating subgraph APIs via dashboard API', async () => {
    for (const subgraph of [usersSubgraphApi, productsSubgraphApi, reviewsSubgraphApi]) {
      const body = newAPIdefinitionWithDefaults(subgraph);
      console.log('>>>>>> REQUEST BODY <<<<<<<');
      console.log(JSON.stringify(body));
      await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
    }
  });

  await test.step('Prerequisites: creating a supergraph to be used in further tests', async () => {
    await main_page.openAPIs();
    expect.poll(async () => {
      const isAddNewApiButtonVisible = await apis_page.ADD_NEW_API_BUTTON.isVisible();
      if (isAddNewApiButtonVisible) {
        await page.reload();
      }
      return isAddNewApiButtonVisible;
    }, { timeout: 20000 });
    await apis_page.ADD_NEW_API_BUTTON.click();
    await apis_page.API_NAME_INPUT.fill(apiDetails.supergraphName);
    await apis_page.API_TYPE_FEDERATION_BUTTON.click();
    await apis_page.API_TYPE_SUPERGRAPH_BUTTON.click();
    await graphql_page.GRAPHQL_SUBGRAPHS_DROPDOWN.selectOptions([apiDetails.usersSubgraphName, apiDetails.productsSubgraphName]);
    await apis_page.CONFIGURE_API_BUTTON.click();
    await assert(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toBeVisible();
    await apis_page.SAVE_BUTTON.click();
  });

  await test.step('Supergraph schema should be generated from subgraphs', async () => {
    await main_page.openAPIs();
    $supergraphTableElement = page.locator(`span:text("${apiDetails.supergraphName}")`);
    await $supergraphTableElement.click();
    await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
    await graphql_page.verifySchemaEditorContents(supergraphVerificationArray, supergraphSchemaEditorXpath);
  });

  await test.step('Subgraphs tab should show subgraphs the supergraph consists of', async () => {
    await graphql_page.GRAPHQL_SUBGRAPHS_TAB_BUTTON.click();
    await assert(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.usersSubgraphName)).toBeVisible();
    await assert(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.productsSubgraphName)).toBeVisible();
  });

  await test.step('Subgraphs tab should show subgraph schemas', async () => {
    await graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.usersSubgraphName).click();
    await graphql_page.verifySchemaEditorContents(usersVerificationArray, usersSchemaEditorXpath);
  });

  await test.step('User should be able to add a subgraph to an existing supergraph', async () => {
    await graphql_page.FEDERATION_ADD_SUBGRAPH_BUTTON.click();
    await graphql_page.FEDERATION_ADD_SUBGRAPH_DROPDOWN.selectOptions([apiDetails.reviewsSubgraphName]);
    await graphql_page.FEDERATION_ADD_BUTTON.click();
    await assert(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.reviewsSubgraphName)).toBeVisible();
  });

  await test.step('User should be able to remove a subgraph from a supergraph', async () => {
    await graphql_page.getFEDERATION_REMOVE_SUBGRAPH_BUTTON(apiDetails.reviewsSubgraphName).click();
    await graphql_page.FEDERATION_REMOVE_SUBGRAPH_CONFIRM_CHECKBOX.click();
    await graphql_page.FEDERATION_REMOVE_SUBGRAPH_MODAL_BUTTON.click();
    await assert(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.reviewsSubgraphName)).not.toBeVisible();
  });
});