import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

describe('UDG with internal REST and GQL datasources', () => {

    const apiDetails = {
        name: "UDG-InternalSources"
    };

    const udgDetails = {
        internalRestQuery: "internalRestQuery",
        restType: "RestType",
        internalRestSource: "internalRestSource",
        restApiEndpoint: "/someEndpoint",
        internalGqlQuery: "GqlQuery",
        gqlType: "GqlType",
        internalGqlSource: "internalGqlSource",
        existingSourceQuery: "existingSourceQuery"
    };

    const restApi = {
        "name": "restApi",
        "version_data": {
            "not_versioned": false,
            "versions": {
                "Default": {
                    "name": "Default",
                    "expires": "",
                    "paths": {
                        "ignored": [],
                        "white_list": [],
                        "black_list": []
                    },
                    "use_extended_paths": true,
                    "extended_paths": {
                        "hard_timeouts": [
                            {
                                "disabled": false,
                                "path": udgDetails.restApiEndpoint,
                                "method": "GET",
                                "timeout": 60
                            }
                        ]
                    }
                }
            }
        }
    };

    const gqlApi = {
        "name": "gqlApi",        
        "graphql": {
            "enabled": true,
            "schema": "directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE\n\nenum CacheControlScope {\n  PUBLIC\n  PRIVATE\n}\n\ntype Continent {\n  code: ID!\n  name: String!\n  countries: [Country!]!\n}\n\ninput ContinentFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Country {\n  code: ID!\n  name: String!\n  native: String!\n  phone: String!\n  continent: Continent!\n  capital: String\n  currency: String\n  languages: [Language!]!\n  emoji: String!\n  emojiU: String!\n  states: [State!]!\n}\n\ninput CountryFilterInput {\n  code: StringQueryOperatorInput\n  currency: StringQueryOperatorInput\n  continent: StringQueryOperatorInput\n}\n\ntype Language {\n  code: ID!\n  name: String\n  native: String\n  rtl: Boolean!\n}\n\ninput LanguageFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Query {\n  continents(filter: ContinentFilterInput): [Continent!]!\n  continent(code: ID!): Continent\n  countries(filter: CountryFilterInput): [Country!]!\n  country(code: ID!): Country\n  languages(filter: LanguageFilterInput): [Language!]!\n  language(code: ID!): Language\n}\n\ntype State {\n  code: String\n  name: String!\n  country: Country!\n}\n\ninput StringQueryOperatorInput {\n  eq: String\n  ne: String\n  in: [String]\n  nin: [String]\n  regex: String\n  glob: String\n}\n\n\"\"\"The `Upload` scalar type represents a file upload.\"\"\"\nscalar Upload\n"
        },
        "proxy": {
            "target_url": "https://countries.trevorblades.com/"
        }
    };

    const dashboard_connection = new Dashboard_connection();

    let $apiTableElement;
    let envDetails;
    let refreshCounter = 0;

    before(() => {
        envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    it('Prerequisites: creating APIs for internal datasources via dashboard API', () => {
        [restApi, gqlApi].forEach(api => {
            let body = newAPIdefinitionWithDefaults(api);
            dashboard_connection.createAPI(body, envDetails.userSecret);
        })
    });

    it('User should be able to create a UDG API with internal REST and GraphQL datasources', () => {
        main_page.openAPIs();
        while(!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5){
            browser.refresh();
            browser.pause(2000);
            refreshCounter++;
        }
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.name);
        apis_page.API_TYPE_UDG_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.UDG_DATA_SOURCES_MODE_BUTTON.click();
        //Add a Query type field with internal REST data source
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", "Fields").click();
        apis_page.UDG_DATA_SOURCE_TAB_BUTTON.click();
        apis_page.UDG_DEFINE_DATASOURCES_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_TYPE_DROPDOWN.selectOption("TYK REST");
        apis_page.UDG_DATA_SOURCE_TYK_APIS_DROPDOWN.selectOption(restApi.name);
        apis_page.UDG_DATA_SOURCE_ENDPOINT.selectOption(udgDetails.restApiEndpoint);
        browser.pause(5000);
        wdioExpect(apis_page.UDG_DATA_SOURCE_ENDPOINT).toHaveText(udgDetails.restApiEndpoint);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.internalRestSource);
        apis_page.UDG_DATA_SOURCE_METHOD.selectOption("POST");
        apis_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Scalars");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption("String");
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.internalRestQuery);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
        //Add a Query type field with internal GQL data source
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", "Fields").click();
        apis_page.UDG_DATA_SOURCE_TAB_BUTTON.click();
        apis_page.UDG_DEFINE_DATASOURCES_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_TYPE_DROPDOWN.selectOption("TYK GraphQL");
        apis_page.UDG_DATA_SOURCE_TYK_APIS_DROPDOWN.selectOption(gqlApi.name);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.internalGqlSource);
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Scalars");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption("String");
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.internalGqlQuery);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
        apis_page.SAVE_BUTTON.click();
    });

    it('User can create a field with an existing data source', () => {
        $apiTableElement = $(`span=${apiDetails.name}`);
        $apiTableElement.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.UDG_DATA_SOURCES_MODE_BUTTON.click();
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", "Fields").click();
        apis_page.UDG_DATA_SOURCE_TAB_BUTTON.click();
        apis_page.UDG_DEFINE_DATASOURCES_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_EXISTING_DATA_SOURCE_DROPDOWN.selectOption(restApi.name);
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Scalars");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption("String");
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.existingSourceQuery);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
    });

    it('User should be able to delete a UDG object field with internal data sources', () => {
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", udgDetails.existingSourceQuery).click();
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DELETE_FIELD_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", udgDetails.existingSourceQuery)).not.toExist();
    });
});