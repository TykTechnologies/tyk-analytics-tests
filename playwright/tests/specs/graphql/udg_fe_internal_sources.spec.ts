import { test, assert } from '@fixtures';
import { Locator } from '@playwright/test';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

test('UDG with internal REST and GQL datasources', async ({ createUserAndLogin, main_page, apis_page, graphql_page, page }) => {

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
    let $apiTableElement: Locator;

    let refreshCounter = 0;

    const dashboard_connection = new Dashboard_connection();

    await test.step('Prerequisites: creating APIs for internal datasources via dashboard API', async () => {
        [restApi, gqlApi].forEach(api => {
            let body = newAPIdefinitionWithDefaults(api);
            await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
        })
    });

    await test.step('User should be able to create a UDG API with internal REST and GraphQL datasources', async () => {
        await main_page.openAPIs();
        // while(!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5){
        //     await page.reload();
        //     // browser.pause(2000);
        //     refreshCounter++;
        // }
        await apis_page.ADD_NEW_API_BUTTON.click();
        await apis_page.API_NAME_INPUT.fill(udgDetails.apiName);
        await apis_page.API_TYPE_UDG_BUTTON.click();
        await apis_page.CONFIGURE_API_BUTTON.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        await graphql_page.uploadSchemaFile(schemaFileRelativePath);
        await apis_page.SAVE_BUTTON.click();
        await main_page.openAPIs();
        $apiTableElement = page.locator(`span:text-is('${udgDetails.apiName}')`);
        await $apiTableElement.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define internal REST data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", await udgDetails.restQuery).click();
        graphql_page.UDG_EXPAND_REST_TYK_ACCORDION.expand();
        await graphql_page.UDG_SELECT_REST_API_OPEN_COMBOBOX.click();
        graphql_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(restApi.name);
        await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.restSource);
        await graphql_page.UDG_DATA_SOURCE_ENDPOINT_INPUT.fill(udgDetails.restApiEndpoint);
        await graphql_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toBeVisible();
        //Define internal GQL data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", await udgDetails.gqlQuery).click();
        graphql_page.UDG_EXPAND_GRAPHQL_TYK_ACCORDION.expand();
        await graphql_page.UDG_SELECT_GRAPHQL_API_OPEN_COMBOBOX.click();
        graphql_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(gqlApi.name);
        await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.gqlSource);
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toBeVisible();
    });

    await test.step('User should be able to remove an internal data source from an object', async () => {
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", await udgDetails.restQuery).click();
        await graphql_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toBeVisible();
    });
});