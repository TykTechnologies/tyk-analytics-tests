import { expect } from 'chai';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';
import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { prepareFederationExampleUpstream } from '../../../lib/utils/federation_example';
import { FEDERATION_UPSTREAM_HOST } from '../../../config_variables';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

xdescribe('Federation API frontend', () => {
    const apiDetails = {
        supergraphName: "Super-test",
        usersSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4001/query`,
        usersSubgraphName: "Users-test",
        productsSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4002/query`,
        productsSubgraphName: "Products-test",
        reviewsSubgraphUrl: `http://${FEDERATION_UPSTREAM_HOST}:4003/query`,
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

    const dashboard_connection = new Dashboard_connection();

    let $supergraphTableElement;
    let envDetails;
    let refreshCounter = 0;

    before(() => {
        envDetails = setUpEnv();
        const isFederationUpstreamRunning = prepareFederationExampleUpstream();
        expect(isFederationUpstreamRunning).to.be.true;
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    it('Prerequisites: creating subgraph APIs via dashboard API', () => {
        [usersSubgraphApi, productsSubgraphApi, reviewsSubgraphApi].forEach(api => {
            let body = newAPIdefinitionWithDefaults(api);
            dashboard_connection.createAPI(body, envDetails.userSecret);
        })
    });

    it('Prerequisites: creating a supergraph to be used in further tests', () => {
        main_page.openAPIs();
        while(!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5){
            browser.refresh();
            browser.pause(2000);
            refreshCounter++;
        }
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.supergraphName);
        apis_page.API_TYPE_FEDERATION_BUTTON.click();
        apis_page.API_TYPE_SUPERGRAPH_BUTTON.click();
        graphql_page.GRAPHQL_SUBGRAPHS_DROPDOWN.selectOptions([apiDetails.usersSubgraphName, apiDetails.productsSubgraphName]);
        apis_page.CONFIGURE_API_BUTTON.click();
        wdioExpect(graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON).toExist();
        apis_page.SAVE_BUTTON.click();
    });

    it('Subgraphs tab should show subgraphs the supergraph consists of', () => {
        $supergraphTableElement = $(`span=${apiDetails.supergraphName}`);
        $supergraphTableElement.click();
        graphql_page.GRAPHQL_SUBGRAPHS_TAB_BUTTON.click();
        wdioExpect(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.usersSubgraphName)).toExist();
        wdioExpect(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.productsSubgraphName)).toExist();
    });

    it('User should be able to add a subgraph to an existing supergraph', () => {
        graphql_page.FEDERATION_ADD_SUBGRAPH_BUTTON.click();
        graphql_page.FEDERATION_ADD_SUBGRAPH_DROPDOWN.selectOptions([apiDetails.reviewsSubgraphName]);
        graphql_page.FEDERATION_ADD_BUTTON.click();
        wdioExpect(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.reviewsSubgraphName)).toExist();
    });

    it('User should be able to remove a subgraph from a supergraph', () => {
        graphql_page.getFEDERATION_REMOVE_SUBGRAPH_BUTTON(apiDetails.reviewsSubgraphName).click();
        graphql_page.FEDERATION_REMOVE_SUBGRAPH_CONFIRM_CHECKBOX.click();
        graphql_page.FEDERATION_REMOVE_SUBGRAPH_MODAL_BUTTON.click();
        wdioExpect(graphql_page.getFEDERATION_SUBGRAPHS_LIST_PANEL(apiDetails.reviewsSubgraphName)).not.toExist();
    });
});