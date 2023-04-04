import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';

describe('CRUD simple GraphQL (proxy-only) API', () => {
    const apiDetails = {
        name: "GraphQL-test"
    };
    let $apiTableElement;

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    it('User should be able to create new GraphQL API', () => {
        main_page.openAPIs();
        apis_page.DESIGN_API_BOX.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.name);
        apis_page.API_TYPE_GRAPHQL_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_UPDATE_SCHEMA_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
    });
    
    it('New GraphQL API should be visible in table', () => {
        $apiTableElement = $(`span=${apiDetails.name}`);
        wdioExpect($apiTableElement).toBeClickable();
    });

    it('User should be able to update GraphQL API', () => {
        $apiTableElement.click();
        graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.click();
        expect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
        apis_page.UPDATE_BUTTON.click();
        apis_page.UPDATE_API_BUTTON.click();        
        wdioExpect(apis_page.API_UPDATED_MESSAGE).toExist();
        main_page.openAPIs();
        $apiTableElement.click();
        expect(graphql_page.GRAPHQL_ENABLE_PLAYGROUND_TOGGLE.isSelected()).to.be.true;
    });

    it('User should be able to delete GraphQL API', () => {
        apis_page.OPTIONS_BUTTON.click();
        apis_page.DELETE_BUTTON.click();
        apis_page.DELETE_API_BUTTON.click();
        wdioExpect(apis_page.API_DELETED_MESSAGE).toExist();
    });

    it('Deleted API should not be visible', () => {
        wdioExpect($apiTableElement).not.toBeDisplayed();
    });
});