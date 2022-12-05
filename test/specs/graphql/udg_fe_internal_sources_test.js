import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import { agent } from 'superagent';

describe('UDG with internal REST and GQL datasources', () => {

    const udgDetails = {
        apiName: "UDG-InternalSources",
        restQuery: "restQuery",
        restType: "RestType",
        restTypeField1: "restTypeField1",
        restSource: "restSource",
        restApiEndpoint: "/someEndpoint",
        gqlQuery: "gqlQuery",
        gqlType: "GqlType",
        gqlTypeField1: "gqlTypeField1",
        gqlSource: "gqlSource",
        fieldMappingPath: "fieldMapping",
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
            "execution_mode": "proxyOnly",
            "schema": "directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE\n\nenum CacheControlScope {\n  PUBLIC\n  PRIVATE\n}\n\ntype Continent {\n  code: ID!\n  name: String!\n  countries: [Country!]!\n}\n\ninput ContinentFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Country {\n  code: ID!\n  name: String!\n  native: String!\n  phone: String!\n  continent: Continent!\n  capital: String\n  currency: String\n  languages: [Language!]!\n  emoji: String!\n  emojiU: String!\n  states: [State!]!\n}\n\ninput CountryFilterInput {\n  code: StringQueryOperatorInput\n  currency: StringQueryOperatorInput\n  continent: StringQueryOperatorInput\n}\n\ntype Language {\n  code: ID!\n  name: String\n  native: String\n  rtl: Boolean!\n}\n\ninput LanguageFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Query {\n  continents(filter: ContinentFilterInput): [Continent!]!\n  continent(code: ID!): Continent\n  countries(filter: CountryFilterInput): [Country!]!\n  country(code: ID!): Country\n  languages(filter: LanguageFilterInput): [Language!]!\n  language(code: ID!): Language\n}\n\ntype State {\n  code: String\n  name: String!\n  country: Country!\n}\n\ninput StringQueryOperatorInput {\n  eq: String\n  ne: String\n  in: [String]\n  nin: [String]\n  regex: String\n  glob: String\n}\n\n\"\"\"The `Upload` scalar type represents a file upload.\"\"\"\nscalar Upload\n",
            "version": "2"
        },
        "proxy": {
            "target_url": "https://countries.trevorblades.com/"
        }
    };

    const schemaFileRelativePath = "../../test/specs/graphql/udg-schema.gql";
    let $apiTableElement;
    let envDetails;
    let refreshCounter = 0;
    
    const dashboard_connection = new Dashboard_connection();

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
        apis_page.API_NAME_INPUT.setValue(udgDetails.apiName);
        apis_page.API_TYPE_UDG_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.uploadSchemaFile(schemaFileRelativePath);
        apis_page.SAVE_BUTTON.click();
        $apiTableElement = $(`span=${udgDetails.apiName}`);
        $apiTableElement.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define internal REST data source for a Query type field
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        apis_page.UDG_EXPAND_REST_TYK_ACCORDION.expand();
        apis_page.UDG_SELECT_REST_API_OPEN_COMBOBOX.click();
        apis_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(restApi.name);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.restSource);
        apis_page.UDG_DATA_SOURCE_ENDPOINT_INPUT.setValue(udgDetails.restApiEndpoint);
        apis_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toExist();
        //Define internal GQL data source for a Query type field
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.gqlQuery).click();
        apis_page.UDG_EXPAND_GRAPHQL_TYK_ACCORDION.expand();
        apis_page.UDG_SELECT_GRAPHQL_API_OPEN_COMBOBOX.click();
        apis_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(gqlApi.name);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.gqlSource);
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toExist();
    });

    it('User should be able to remove an internal data source from an object', () => {
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        apis_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toExist();
    });
});