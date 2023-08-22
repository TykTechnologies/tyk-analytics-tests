import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';
import { test, assert } from '@fixtures';

import { FEDERATION_UPSTREAM_HOST } from '../../../config_variables';


test('CRUD basic Federation API', async ({ createUserAndLogin, main_page }) => {
    const apiDetails = {
        supergraphName: "Super-test",
        usersSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4001/query`,
        usersSubgraphName: "Users-test",
        productsSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4002/query`,
        productsSubgraphName: "Products-test",
        reviewsSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4003/query`,
        reviewsSubgraphName: "Reviews-test"        
    };
    let $supergraphTableElement;
    let $usersTableElement;
    let $productsTableElement;
    let $reviewsTableElement;

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    await test.step('User should be able to create new Federation Subgraph API', async () => {
        main_page.openAPIs();
       await apis_page.DESIGN_API_BOX.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.usersSubgraphName);
       await apis_page.API_TYPE_FEDERATION_BUTTON.click();
       await apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
       await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.usersSubgraphUrl);
       await apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
       await apis_page.SAVE_BUTTON.click();
    });
    
    await test.step('New Federation Subgraph API should be visible in table', async () => {
        main_page.openAPIs();
        $usersTableElement = $(`span=${apiDetails.usersSubgraphName}`);
        wdioExpect($usersTableElement).toBeClickable();
    });

    await test.step('User should be able to update Federation Subgraph API', async () => {
        $usersTableElement.click();
       await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        wdioExpect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
       await apis_page.UPDATE_BUTTON.click();
       await apis_page.UPDATE_API_BUTTON.click();
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $usersTableElement.click();
        wdioExpect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
    });

    it('User should be able to create additional Subgraph APIs', () =>{
        //Products subgraph
        main_page.openAPIs();
       await apis_page.ADD_NEW_API_BUTTON.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.productsSubgraphName);
       await apis_page.API_TYPE_FEDERATION_BUTTON.click();
       await apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
       await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.productsSubgraphUrl);
       await apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
       await apis_page.SAVE_BUTTON.click();
        //Reviews subgraph
        main_page.openAPIs();
       await apis_page.ADD_NEW_API_BUTTON.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.reviewsSubgraphName);
       await apis_page.API_TYPE_FEDERATION_BUTTON.click();
       await apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
       await apis_page.OAS_TARGET_URL_INPUT.fill(apiDetails.reviewsSubgraphUrl);
       await apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
       await apis_page.SAVE_BUTTON.click();
    });
       
    await test.step('Additional Federation Subgraph APIs should be visible in table', async () => {
        main_page.openAPIs();
        $productsTableElement = $(`span=${apiDetails.productsSubgraphName}`);
        wdioExpect($productsTableElement).toBeClickable();
        $reviewsTableElement = $(`span=${apiDetails.reviewsSubgraphName}`);
        wdioExpect($reviewsTableElement).toBeClickable();
    });

    await test.step('User should be able to create a Federation Supergraph API ', async () => {
       await apis_page.ADD_NEW_API_BUTTON.click();
       await apis_page.API_NAME_INPUT.fill(apiDetails.supergraphName);
       await apis_page.API_TYPE_FEDERATION_BUTTON.click();
       await apis_page.API_TYPE_SUPERGRAPH_BUTTON.click();
        graphql_page.GRAPHQL_SUBGRAPHS_DROPDOWN.selectOptions([apiDetails.usersSubgraphName, apiDetails.productsSubgraphName, apiDetails.reviewsSubgraphName])
       await apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
       await apis_page.SAVE_BUTTON.click();
    });

    await test.step('New Federation Supergraph API should be visible in table', async () => {
        main_page.openAPIs();
        $supergraphTableElement = $(`span=${apiDetails.supergraphName}`);
        wdioExpect($supergraphTableElement).toBeClickable();
    });

    await test.step('User should be able to update Federation Supergraph API', async () => {
        $supergraphTableElement.click();
       await graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        wdioExpect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
       await apis_page.UPDATE_BUTTON.click();
       await apis_page.UPDATE_API_BUTTON.click();
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $supergraphTableElement.click();
        wdioExpect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE).toBeSelected();
    });
    
    await test.step('User should be able to delete Federation APIs', async () => {
        //Supergraph
        main_page.openAPIs();
        $supergraphTableElement.click();
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Users subgraph
        main_page.openAPIs();
        $usersTableElement.click();
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Products subgraph
        main_page.openAPIs();
        $productsTableElement.click();
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Reviews subgraph
        main_page.openAPIs();
        $reviewsTableElement.click();
       await apis_page.OPTIONS_BUTTON.click();
       await apis_page.DELETE_BUTTON.click();
       await apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
    });

    await test.step('Deleted APIs should not be visible', async () => {
        wdioExpect($supergraphTableElement).not.toBeDisplayed();
        wdioExpect($usersTableElement).not.toBeDisplayed();
        wdioExpect($productsTableElement).not.toBeDisplayed();
        wdioExpect($reviewsTableElement).not.toBeDisplayed();
    });
    
});
