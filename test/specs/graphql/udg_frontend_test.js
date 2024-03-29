import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { graphql_page } from '../../../lib/pom/Graphql_page';
import { main_page } from '../../../lib/pom/Main_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
const path = require('path');


describe('UDG with REST and GQL datasources', () => {

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
    let envDetails;
    
    const dashboard_connection = new Dashboard_connection();

    before(() => {
        envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    xit('Prerequisites: creating the UDG api via Dashboard API', () => {
        let body = newAPIdefinitionWithDefaults(udgApi);
        dashboard_connection.createAPI(body, envDetails.userSecret)
    });

    xit('User should be able to define external REST, GraphQL and Kafka datasources in a UDG API', () => {
        main_page.openAPIs();
        $apiTableElement = $(`span=${udgApi.name}`);
        while (!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5) {
            browser.refresh();
            browser.pause(2000);
            main_page.openAPIs();
        }
        $apiTableElement.click();
        graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define REST data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        graphql_page.UDG_CONFIGURE_EXTERNAL_REST_BUTTON.click();
        graphql_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.restSource);
        graphql_page.UDG_DATA_SOURCE_URL_INPUT.click();
        graphql_page.keys(udgDetails.restDataSourceUrl);
        wdioExpect($(`//li//span[text()="${udgDetails.restQuery}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).toExist();
        graphql_page.UDG_TEMPLATING_SYNTAX_FILTER.setValue("rest");
        wdioExpect($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).not.toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).not.toExist();
        graphql_page.UDG_TEMPLATING_SYNTAX_HINT_LIST.selectComboboxOption(udgDetails.restQuery);
        wdioExpect(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveText(udgDetails.expectedFullRestDataSourceUrl);
        graphql_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
        graphql_page.UDG_ADD_HEADER_BUTTON.click();
        graphql_page.UDG_NEW_HEADER_KEY_INPUT.setValue(udgDetails.headerKey);
        graphql_page.UDG_NEW_HEADER_VALUE_INPUT.setValue(udgDetails.headerValue);
        graphql_page.UDG_ADD_HEADER_BUTTON.click();
        graphql_page.UDG_NEW_HEADER_KEY_INPUT.setValue("tempHeaderKey");
        graphql_page.UDG_NEW_HEADER_VALUE_INPUT.setValue("tempHeaderValue");
        graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        wdioExpect(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toExist();
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.setValue(udgDetails.fieldMappingPath);
        graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toExist();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toExist();
        //Define GQL data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.gqlQuery).click();
        graphql_page.UDG_CONFIGURE_EXTERNAL_GQL_BUTTON.click();
        graphql_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.gqlSource);
        graphql_page.UDG_DATA_SOURCE_URL_INPUT.click();
        graphql_page.keys(udgDetails.gqlDataSourceUrl);
        graphql_page.UDG_ADD_HEADERS_CHECKBOX.check();
        graphql_page.UDG_ADD_HEADER_BUTTON.click();
        graphql_page.UDG_NEW_HEADER_KEY_INPUT.setValue(udgDetails.headerKey);
        graphql_page.UDG_NEW_HEADER_VALUE_INPUT.setValue(udgDetails.headerValue);
        graphql_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        wdioExpect(graphql_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toExist();
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        graphql_page.UDG_FIELD_MAPPING_PATH_INPUT.setValue(udgDetails.fieldMappingPath);
        graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toExist();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toExist();
        //Define Kafka data source for a Query type field
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.kafkaQuery).click();
        graphql_page.UDG_CONFIGURE_EXTERNAL_KAFKA_BUTTON.click();
        graphql_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.kafkaSource);
        graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).setValue("tempBrokerAddress");
        graphql_page.UDG_ADD_BROKER_ADDRESSES_BUTTON.click();
        graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).setValue("BrokerAddress");
        graphql_page.getUDG_BROKER_ADDRESSES_DELETE_BY_POSITION_BUTTON(2).click();
        wdioExpect(graphql_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(2)).not.toExist();
        graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(1).setValue("tempTopic");
        graphql_page.UDG_ADD_TOPICS_BUTTON.click();
        graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(1).setValue("BrokerAddress");
        graphql_page.getUDG_TOPICS_DELETE_BY_POSITION_BUTTON(2).click();
        wdioExpect(graphql_page.getUDG_TOPICS_BY_POSITION_INPUT(2)).not.toExist();
        graphql_page.UDG_GROUP_ID_INPUT.setValue("GroupID");
        graphql_page.UDG_CLIENT_ID_INPUT.setValue("ClientID");
        graphql_page.UDG_KAFKA_VERSION_DROPDOWN.selectFirstOption();
        graphql_page.UDG_BALANCE_STRATEGY_DROPDOWN.selectFirstOption();
        graphql_page.UDG_START_CONSUMING_LATEST_CHECKBOX.check();
        graphql_page.UDG_READ_COMMITTED_BUTTON.click();
        graphql_page.UDG_ENABLE_SASL_CHECKBOX.check();
        graphql_page.UDG_SASL_USER_INPUT.setValue("SaslUser");
        graphql_page.UDG_SASL_PASSWORD_INPUT.setValue("SaslPassword");
        graphql_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.kafkaQuery, udgDetails.kafkaSource)).toExist();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.kafkaQuery, "Kafka")).toExist();
    });

    xit('User should be able to assign an existing data source to an object in an UDG API', () => {
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON(udgDetails.gqlType, udgDetails.gqlTypeField1).click();
        graphql_page.UDG_EXPAND_DATA_SOURCES_ACCORDION.expand();
        graphql_page.UDG_SELECT_DATA_SOURCE_OPEN_COMBOBOX.click();
        wdioExpect($(`//li//span[text()="${udgDetails.restSource}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.gqlSource}"]`)).toExist();
        graphql_page.UDG_COMBOBOX_FILTER_INPUT.setValue("gql");
        wdioExpect($(`//li//span[text()="${udgDetails.restSource}"]`)).not.toExist();
        graphql_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(udgDetails.gqlSource);
        wdioExpect(graphql_page.UDG_DATA_SOURCE_CONNECTED_WARNING_MESSAGE).toExist();
        wdioExpect(graphql_page.UDG_DATA_SOURCE_NAME_INPUT).toHaveValue(udgDetails.gqlSource);
        wdioExpect(graphql_page.UDG_DATA_SOURCE_URL_INPUT).toHaveValue(udgDetails.gqlDataSourceUrl);
        wdioExpect(graphql_page.UDG_FIELD_MAPPING_PATH_INPUT).toHaveValue(udgDetails.gqlTypeField1);
        graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME(udgDetails.gqlType, udgDetails.gqlTypeField1, udgDetails.gqlSource)).toExist();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE(udgDetails.gqlType, udgDetails.gqlTypeField1, "GraphQL")).toExist();
    });

    xit('User should be able to remove a data source from an object', () => {
        graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        graphql_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
        graphql_page.UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toExist();
        wdioExpect(graphql_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toExist();
    });

    xit('User should be able to upload a schema file in a UDG API', () => {
        main_page.openAPIs();
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(udgDetails.fileUploadApiName);
        apis_page.API_TYPE_UDG_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        graphql_page.uploadSchemaFile(schemaFileRelativePath);
        graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
        apis_page.SAVE_BUTTON.click();
        //Verify file upload again after saving API
        main_page.openAPIs();
        $apiTableElement = $(`span=${udgDetails.fileUploadApiName}`);
        $apiTableElement.click();
        graphql_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        graphql_page.verifySchemaEditorContents(schemaFileUploadVerificationArray, schemaEditorXpath);
        wdioExpect(graphql_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery));
    });    
});