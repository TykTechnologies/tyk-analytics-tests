import { test, assert } from '@fixtures';
import { Locator } from '@playwright/test';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

test('UDG with REST and GQL datasources', async ({ createUserAndLogin, main_page, apis_page, graphql_page, page }) => {

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
        expectedFullRestDataSourceUrl: "",
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

    //Not used until file uploading is implemented
    const schemaFileUploadVerificationArray = [
        ["type", "Query"],
        ["restQuery", "RestType"],
        ["gqlQuery", "GqlType"],
        ["kafkaQuery", "KafkaType"],
        [], [],
        ["type", "RestType"],
        ["restTypeField1", "String"],
        [], [],
        ["type", "GqlType"],
        ["gqlTypeField1", "String"],
        [], [],
        ["type", "KafkaType"],
        ["kafkaTypeField1", "String"]
    ]

    const schemaEditorXpath = '//div[@class="view-lines monaco-mouse-cursor-text"]';

    const schemaFileRelativePath = "../../test/specs/graphql/udg-schema.gql";
    let $apiTableElement: Locator;    

    const dashboard_connection = new Dashboard_connection();

    await test.step('Prerequisites: creating the UDG api via Dashboard API', async () => {
        let body = newAPIdefinitionWithDefaults(udgApi);
        await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
    });

    await test.step('User should be able to define external REST, GraphQL and Kafka datasources in a UDG API', async () => {
        await main_page.openAPIs();
        $apiTableElement = page.locator(`span:text-is('${udgApi.name}')`);
        await $apiTableElement.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define REST data source for a Query type field
        await graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        await graphql_page.UDG_CONFIGURE_EXTERNAL_REST_BUTTON.click();
        await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.restSource);
        await graphql_page.UDG_DATA_SOURCE_URL_INPUT.element.pressSequentially(udgDetails.restDataSourceUrl, {delay: 50});
        await assert(page.locator(`//li//span[text()="${udgDetails.restQuery}"]`)).toBeVisible();
        await assert(page.locator(`//li//span[text()="${udgDetails.gqlQuery}"]`)).toBeVisible();
        await assert(page.locator(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).toBeVisible();
        await graphql_page.UDG_TEMPLATING_SYNTAX_FILTER.fill("rest");
        await assert(page.locator(`//li//span[text()="${udgDetails.gqlQuery}"]`)).not.toBeVisible();
        await assert(page.locator(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).not.toBeVisible();
        await graphql_page.UDG_TEMPLATING_SYNTAX_HINT_LIST.element.getByText(udgDetails.restQuery, {exact: true}).click() //looks shitty, but works
        await assert(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveText(udgDetails.expectedFullRestDataSourceUrl);
        await graphql_page.UDG_DATA_SOURCE_METHOD.selectOption(/^GET$/);
        await graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
        await graphql_page.UDG_ADD_HEADER_BUTTON.click();
        await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill(udgDetails.headerKey);
        await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill(udgDetails.headerValue);
        await graphql_page.UDG_ADD_HEADER_BUTTON.click();
        await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill("tempHeaderKey");
        await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill("tempHeaderValue");
        await graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        await assert(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toBeVisible();
        await graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        await graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.fill(udgDetails.fieldMappingPath);
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toBeVisible();
        //Define GQL data source for a Query type field
        await graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.gqlQuery).click();
        await graphql_page.UDG_CONFIGURE_EXTERNAL_GQL_BUTTON.click();
        await graphql_page.UDG_DATA_SOURCE_NAME_INPUT.fill(udgDetails.gqlSource);
        await graphql_page.UDG_DATA_SOURCE_URL_INPUT.element.pressSequentially(udgDetails.gqlDataSourceUrl, {delay: 50});
        await graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
        await graphql_page.UDG_ADD_HEADER_BUTTON.click();
        await graphql_page.UDG_NEW_HEADER_KEY_INPUT.fill(udgDetails.headerKey);
        await graphql_page.UDG_NEW_HEADER_VALUE_INPUT.fill(udgDetails.headerValue);
        await graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        await assert(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toBeVisible();
        await graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        await graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.fill(udgDetails.fieldMappingPath);
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toBeVisible();
        //Define Kafka data source for a Query type field
        await graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.kafkaQuery).click();
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
        await graphql_page.UDG_KAFKA_VERSION_DROPDOWN.click();
        await graphql_page.UDG_KAFKA_VERSION_DROPDOWN.selectFirstOption();
        await graphql_page.UDG_BALANCE_STRATEGY_DROPDOWN.click();
        await graphql_page.UDG_BALANCE_STRATEGY_DROPDOWN.selectFirstOption();
        await graphql_page.UDG_START_CONSUMING_LATEST_CHECKBOX.check();
        await graphql_page.UDG_READ_COMMITTED_BUTTON.click();
        await graphql_page.UDG_ENABLE_SASL_CHECKBOX.check();
        await graphql_page.UDG_SASL_USER_INPUT.fill("SaslUser");
        await graphql_page.UDG_SASL_PASSWORD_INPUT.fill("SaslPassword");
        await graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.kafkaQuery, udgDetails.kafkaSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.kafkaQuery, "Kafka")).toBeVisible();
    });

    await test.step('User should be able to assign an existing data source to an object in an UDG API', async () => {
        await graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON(udgDetails.gqlType, udgDetails.gqlTypeField1).click();
        await graphql_page.UDG_EXPAND_DATA_SOURCES_ACCORDION.expand();
        await graphql_page.UDG_SELECT_DATA_SOURCE_OPEN_COMBOBOX.click();
        await assert(page.locator(`//li//span[text()="${udgDetails.restSource}"]`)).toBeVisible();
        await assert(page.locator(`//li//span[text()="${udgDetails.gqlSource}"]`)).toBeVisible();
        await graphql_page.UDG_COMBOBOX_FILTER_INPUT.fill("gql");
        await assert(page.locator(`//li//span[text()="${udgDetails.restSource}"]`)).not.toBeVisible();
        // let regexp = new RegExp("/^"+udgDetails.gqlSource+"$/")
        // await graphql_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(udgDetails.gqlSource);
        await graphql_page.UDG_COMBOBOX_DROPDOWN.element.getByText(udgDetails.gqlSource, {exact: true}).click() //looks shitty, but works
        await assert(graphql_page.UDG_DATA_SOURCE_CONNECTED_WARNING_MESSAGE).toBeVisible();
        await assert(graphql_page.UDG_DATA_SOURCE_NAME_INPUT).toHaveValue(udgDetails.gqlSource);
        await assert(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveValue(udgDetails.gqlDataSourceUrl);
        await assert(graphql_page.UDG_FIELD_MAPPING_PATH_INPUT).toHaveValue(udgDetails.gqlTypeField1);
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME(udgDetails.gqlType, udgDetails.gqlTypeField1, udgDetails.gqlSource)).toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE(udgDetails.gqlType, udgDetails.gqlTypeField1, "GraphQL")).toBeVisible();
    });

    await test.step('User should be able to remove a data source from an object', async () => {
        await graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        await graphql_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
        await graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        await apis_page.CONFIRM_BUTTON.click();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toBeVisible();
        await assert(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toBeVisible();
    });

    /*
    await test.step('User should be able to upload a schema file in a UDG API', async () => {
        await main_page.openAPIs();
        await apis_page.ADD_NEW_API_BUTTON.click();
        await apis_page.API_NAME_INPUT.fill(udgDetails.fileUploadApiName);
        await apis_page.API_TYPE_UDG_BUTTON.click();
        await apis_page.CONFIGURE_API_BUTTON.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        await graphql_page.uploadSchemaFile(schemaFileRelativePath);
        await graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
        await apis_page.SAVE_BUTTON.click();
        //Verify file upload again after saving API
        await main_page.openAPIs();
        $apiTableElement = page.locator(`span:textis('${udgDetails.fileUploadApiName}')`);
        await $apiTableElement.click();
        await graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        await graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
        await assert(graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery));
    });
    */
});