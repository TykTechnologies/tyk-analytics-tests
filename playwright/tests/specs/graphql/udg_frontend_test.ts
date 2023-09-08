import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';

import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';
const path = require('path');


test('UDG with REST and GQL datasources', async ({ createUserAndLogin, main_page }) => {

    const udgDetails = {
        restQuery: "restQuery",
        restType: "RestType",
        restTypeField1: "restTypeField1",
        restSource: "restSource",
        gqlQuery: "gqlQuery",
        gqlType: "GqlType",
        gqlTypeField1: "gqlTypeField1",
        gqlSource: "gqlSource",
        kafkaQuery: "kafkaQuery",
        kafkaType: "kafkaType",
        kafkaTypeField1: "kafkaFieldType1",
        kafkaSource: "kafkaSource",
        headerKey: "someHeader",
        headerValue: "someHeaderValue",
        restDataSourceUrl: "https://swapi.dev/api/people/{",
        expectedFullRestDataSourceUrl: null,
        gqlDataSourceUrl: "https://countries.trevorblades.com/",
        fieldMappingPath: "fieldMapping",
        fileUploadApiName: "UDG-FileUpload"
    };
    udgDetails.expectedFullRestDataSourceUrl = "https://swapi.dev/api/people/{{.object." + udgDetails.restQuery + "}}"

    const udgApi = {
        "name": "UDG-RestAndGql",
        "graphql": {
            "enabled": true,
            "execution_mode": "executionEngine",
            "version": "2",
            "schema": `type Query {\n  ${udgDetails.restQuery}: ${udgDetails.restType}\n  ${udgDetails.gqlQuery}: ${udgDetails.gqlType}\n  ${udgDetails.kafkaQuery}: ${udgDetails.kafkaType}\n}\n\ntype ${udgDetails.restType}{\n  ${udgDetails.restTypeField1}: String\n}\n\ntype ${udgDetails.gqlType}{\n  ${udgDetails.gqlTypeField1}: String\n}\n\ntype ${udgDetails.kafkaType}{\n  ${udgDetails.kafkaTypeField1}: String\n}`
        },
        "internal": false
    }

    const schemaFileUploadVerificationArray = [
        ["type", "Query"],
        ["restQuery", "RestType"],
        ["gqlQuery", "GqlType"],
        ["kafkaQuery", "KafkaType"],
        [],[],
        ["type", "RestType"],
        ["restTypeField1", "String"],
        [],[],
        ["type", "GqlType"],
        ["gqlTypeField1", "String"],
        [],[],
        ["type", "KafkaType"],
        ["kafkaTypeField1", "String"]
    ]

    const schemaEditorXpath = '//div[@class="view-lines monaco-mouse-cursor-text"]';

    const schemaFileRelativePath = "../../test/specs/graphql/udg-schema.gql";
    let $apiTableElement;
    let refreshCounter = 0;
    
    
    const dashboard_connection = new Dashboard_connection();

    xawait test.step('Prerequisites: creating the UDG api via Dashboard API', async () => {
        let body = newAPIdefinitionWithDefaults(udgApi);
        await dashboard_connection.createAPI(body, createUserAndLogin.userSecret)
    });

    xawait test.step('User should be able to define external REST, GraphQL and Kafka datasources in a UDG API', async () => {
        await main_page.openAPIs();
        $apiTableElement = await this.page.locator(`span:text("${udgApi.name}")`);
        while (!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5) {
            await page.reload();
            browser.pause(2000);
            await main_page.openAPIs();
        }
      await $apiTableElement.click();
       await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define REST data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query",await udgDetails.restQuery).click();
       await graphql_page.UDG_CONFIGURE_EXTERNAL_REST_BUTTON.click();
       await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.restSource);
       await graphql_page.UDG_DATA_SOURCE_URL_INPUT.click();
        graphql_page.keys(udgDetails.restDataSourceUrl);
        await assert($(`//li//span[text()="${udgDetails.restQuery}"]`)).toBeVisible();
        await assert($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).toBeVisible();
        await assert($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).toBeVisible();
       await graphql_page.UDG_TEMPLATING_SYNTAX_FILTER.fill("rest");
        await assert($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).not.toBeVisible();
        await assert($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).not.toBeVisible();
        graphql_page.UDG_TEMPLATING_SYNTAX_HINT_LIST.selectComboboxOption(udgDetails.restQuery);
        await assert(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveText(udgDetails.expectedFullRestDataSourceUrl);
       await graphql_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
       await graphql_page.UDG_ADD_HEADER_BUTTON.click();
       await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill(udgDetails.headerKey);
       await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill(udgDetails.headerValue);
       await graphql_page.UDG_ADD_HEADER_BUTTON.click();
       await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill("tempHeaderKey");
       await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill("tempHeaderValue");
       await graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        await assert(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toBeVisible();
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
       await graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.fill(udgDetails.fieldMappingPath);
       await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
       await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toBeVisible();
        //Define GQL data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query",await udgDetails.gqlQuery).click();
       await graphql_page.UDG_CONFIGURE_EXTERNAL_GQL_BUTTON.click();
       await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.gqlSource);
       await graphql_page.UDG_DATA_SOURCE_URL_INPUT.click();
        graphql_page.keys(udgDetails.gqlDataSourceUrl);
        graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
       await graphql_page.UDG_ADD_HEADER_BUTTON.click();
       await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill(udgDetails.headerKey);
       await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill(udgDetails.headerValue);
       await graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        await assert(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toBeVisible();
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
       await graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.fill(udgDetails.fieldMappingPath);
       await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
       await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toBeVisible();
        //Define Kafka data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query",await udgDetails.kafkaQuery).click();
       await graphql_page.UDG_CONFIGURE_EXTERNAL_KAFKA_BUTTON.click();
       await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.kafkaSource);
       await graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).fill("tempBrokerAddress");
       await graphql_page.UDG_ADD_BROKER_ADDRESSES_BUTTON.click();
       await graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).fill("BrokerAddress");
       await graphql_page.getUDG_BROKER_ADDRESSES_DELETE_BY_POSITION_BUTTON(2).click();
        await assert(graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(2)).not.toBeVisible();
       await graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(1).fill("tempTopic");
       await graphql_page.UDG_ADD_TOPICS_BUTTON.click();
       await graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(1).fill("BrokerAddress");
       await graphql_page.getUDG_TOPICS_DELETE_BY_POSITION_BUTTON(2).click();
        await assert(graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(2)).not.toBeVisible();
       await graphql_page.UDG_GROUP_ID_INPUT.fill("GroupID");
       await graphql_page.UDG_CLIENT_ID_INPUT.fill("ClientID");
        graphql_page.UDG_KAFKA_VERSION_DROPDOWN.selectFirstOption();
        graphql_page.UDG_BALANCE_STRATEGY_DROPDOWN.selectFirstOption();
        graphql_page.UDG_START_CONSUMING_LATEST_CHECKBOX.check();
       await graphql_page.UDG_READ_COMMITTED_BUTTON.click();
        graphql_page.UDG_ENABLE_SASL_CHECKBOX.check();
       await graphql_page.UDG_SASL_USER_INPUT.fill("SaslUser");
       await graphql_page.UDG_SASL_PASSWORD_INPUT.fill("SaslPassword");
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
       await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
       await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.kafkaQuery, udgDetails.kafkaSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.kafkaQuery, "Kafka")).toBeVisible();
    });

    xawait test.step('User should be able to assign an existing data source to an object in an UDG API', async () => {
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON(udgDetails.gqlType,await udgDetails.gqlTypeField1).click();
        graphql_page.UDG_EXPAND_DATA_SOURCES_ACCORDION.expand();
       await graphql_page.UDG_SELECT_DATA_SOURCE_OPEN_COMBOBOX.click();
        await assert($(`//li//span[text()="${udgDetails.restSource}"]`)).toBeVisible();
        await assert($(`//li//span[text()="${udgDetails.gqlSource}"]`)).toBeVisible();
       await graphql_page.UDG_COMBOBOX_FILTER_INPUT.fill("gql");
        await assert($(`//li//span[text()="${udgDetails.restSource}"]`)).not.toBeVisible();
        graphql_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(udgDetails.gqlSource);
        await assert(graphql_page.UDG_DATA_SOURCE_CONNECTED_WARNING_MESSAGE).toBeVisible();
        await assert(graphql_page.UDG_DATA_SOURCE_NAME_INPUT).toHaveValue(udgDetails.gqlSource);
        await assert(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveValue(udgDetails.gqlDataSourceUrl);
        await assert(graphql_page.UDG_FIELD_MAPPING_PATH_INPUT).toHaveValue(udgDetails.gqlTypeField1);
       await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
       await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME(udgDetails.gqlType, udgDetails.gqlTypeField1, udgDetails.gqlSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE(udgDetails.gqlType, udgDetails.gqlTypeField1, "GraphQL")).toBeVisible();
    });

    xawait test.step('User should be able to remove a data source from an object', async () => {
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query",await udgDetails.restQuery).click();
       await graphql_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
       await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
       await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toBeVisible();
    });

    xawait test.step('User should be able to upload a schema file in a UDG API', async () => {
        await main_page.openAPIs();
       await apis_page.ADD_NEW_API_BUTTON.click();
       await apis_page.API_NAME_INPUT.fill(udgDetails.fileUploadApiName);
       await apis_page.API_TYPE_UDG_BUTTON.click();
       await apis_page.CONFIGURE_API_BUTTON.click();
       await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        graphql_page.uploadSchemaFile(schemaFileRelativePath);
        graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
       await apis_page.SAVE_BUTTON.click();
        //Verify file upload again after saving API
        await main_page.openAPIs();
        $apiTableElement = await this.page.locator(`span:text("${udgDetails.fileUploadApiName}")`);
      await $apiTableElement.click();
       await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
        await assert(graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery));
    });    
});