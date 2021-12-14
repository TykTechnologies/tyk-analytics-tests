import { expect } from 'chai';
import { apis_page } from '../../../lib/pom/Apis_page';
import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { prepareFederationExampleUpstream } from '../../../lib/utils/utils';
import { FEDERATION_UPSTREAM_HOST } from '../../../config_variables';

describe('CRUD simple GraphQL (proxy-only) API', () => {
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
        const isFederationUpstremRunning = prepareFederationExampleUpstream();
        expect(isFederationUpstremRunning).to.be.true;
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    it('User should be able to create new Federation Subgraph API', () => {
        main_page.openAPIs();
        apis_page.DESIGN_API_BOX.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.usersSubgraphName);
        apis_page.API_TYPE_FEDERATION_BUTTON.click();
        apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
        apis_page.OAS_TARGET_URL_INPUT.setValue(apiDetails.usersSubgraphUrl);
        apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(apis_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
    });
    
    it('New Federation Subgraph API should be visible in table', () => {
        $usersTableElement = $(`span=${apiDetails.usersSubgraphName}`);
        wdioExpect($usersTableElement).toBeClickable();
    });

    it('User should be able to update Federation Subgraph API', () => {
        $usersTableElement.click();
        apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        expect(apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
        apis_page.UPDATE_BUTTON.click();
        apis_page.UPDATE_API_BUTTON.click();
        //expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $usersTableElement.click();
        expect(apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
    });

    it('User should be able to create additional Subgraph APIs', () =>{
        //Products subgraph
        main_page.openAPIs();
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.productsSubgraphName);
        apis_page.API_TYPE_FEDERATION_BUTTON.click();
        apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
        apis_page.OAS_TARGET_URL_INPUT.setValue(apiDetails.productsSubgraphUrl);
        apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(apis_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
        //Reviews subgraph
        main_page.openAPIs();
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.reviewsSubgraphName);
        apis_page.API_TYPE_FEDERATION_BUTTON.click();
        apis_page.API_TYPE_SUBGRAPH_BUTTON.click();
        apis_page.OAS_TARGET_URL_INPUT.setValue(apiDetails.reviewsSubgraphUrl);
        apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(apis_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
    });
       
    it('Additional Federation Subgraph APIs should be visible in table', () => {
        $productsTableElement = $(`span=${apiDetails.productsSubgraphName}`);
        wdioExpect($productsTableElement).toBeClickable();
        $reviewsTableElement = $(`span=${apiDetails.reviewsSubgraphName}`);
        wdioExpect($reviewsTableElement).toBeClickable();
    });

    it('User should be able to create a Federation Supergraph API ', () => {
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.supergraphName);
        apis_page.API_TYPE_FEDERATION_BUTTON.click();
        apis_page.API_TYPE_SUPERGRAPH_BUTTON.click();
        apis_page.GRAPHQL_SUBGRAPHS_DROPDOWN.selectOptions([apiDetails.usersSubgraphName, apiDetails.productsSubgraphName, apiDetails.reviewsSubgraphName])
        apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(apis_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
    });

    it('New Federation Supergraph API should be visible in table', () => {
        $supergraphTableElement = $(`span=${apiDetails.supergraphName}`);
        wdioExpect($supergraphTableElement).toBeClickable();
    });

    it('User should be able to update Federation Supergraph API', () => {
        $supergraphTableElement.click();
        apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        expect(apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
        apis_page.UPDATE_BUTTON.click();
        apis_page.UPDATE_API_BUTTON.click();
        //expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $supergraphTableElement.click();
        expect(apis_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
    });
    
    it('User should be able to delete Federation APIs', () => {
        //Supergraph
        main_page.openAPIs();
        $supergraphTableElement.click();
        apis_page.OPTIONS_BUTTON.click();
        apis_page.DELETE_BUTTON.click();
        apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Users subgraph
        main_page.openAPIs();
        $usersTableElement.click();
        apis_page.OPTIONS_BUTTON.click();
        apis_page.DELETE_BUTTON.click();
        apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Products subgraph
        main_page.openAPIs();
        $productsTableElement.click();
        apis_page.OPTIONS_BUTTON.click();
        apis_page.DELETE_BUTTON.click();
        apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
        //Reviews subgraph
        main_page.openAPIs();
        $reviewsTableElement.click();
        apis_page.OPTIONS_BUTTON.click();
        apis_page.DELETE_BUTTON.click();
        apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
    });

    it('Deleted APIs should not be visible', () => {
        wdioExpect($supergraphTableElement).not.toBeDisplayed();
        wdioExpect($usersTableElement).not.toBeDisplayed();
        wdioExpect($productsTableElement).not.toBeDisplayed();
        wdioExpect($reviewsTableElement).not.toBeDisplayed();
    });
    
});