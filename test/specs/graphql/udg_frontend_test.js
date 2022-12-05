import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
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

    it('Prerequisites: creating the UDG api via Dashboard API', () => {
        let body = newAPIdefinitionWithDefaults(udgApi);
        dashboard_connection.createAPI(body, envDetails.userSecret)
    });

    it('User should be able to define external REST, GraphQL and Kafka datasources in a UDG API', () => {
        main_page.openAPIs();
        $apiTableElement = $(`span=${udgApi.name}`);
        while (!apis_page.ADD_NEW_API_BUTTON.isExisting() && refreshCounter < 5) {
            browser.refresh();
            browser.pause(2000);
            main_page.openAPIs();
        }
        $apiTableElement.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        //Define REST data source for a Query type field
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        apis_page.UDG_CONFIGURE_EXTERNAL_REST_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.restSource);
        apis_page.UDG_DATA_SOURCE_URL_INPUT.setValue(udgDetails.restDataSourceUrl);
        wdioExpect($(`//li//span[text()="${udgDetails.restQuery}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).toExist();
        apis_page.UDG_TEMPLATING_SYNTAX_FILTER.setValue("rest");
        wdioExpect($(`//li//span[text()="${udgDetails.gqlQuery}"]`)).not.toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.kafkaQuery}"]`)).not.toExist();
        apis_page.UDG_TEMPLATING_SYNTAX_HINT_LIST.selectComboboxOption(udgDetails.restQuery);
        wdioExpect(apis_page.UDG_DATA_SOURCE_URL_INPUT).toHaveText(udgDetails.expectedFullRestDataSourceUrl);
        apis_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        apis_page.UDG_ADD_HEADERS_CHECKBOX.check();
        apis_page.UDG_ADD_HEADER_BUTTON.click();
        apis_page.UDG_NEW_HEADER_KEY_INPUT.setValue(udgDetails.headerKey);
        apis_page.UDG_NEW_HEADER_VALUE_INPUT.setValue(udgDetails.headerValue);
        apis_page.UDG_ADD_HEADER_BUTTON.click();
        apis_page.UDG_NEW_HEADER_KEY_INPUT.setValue("tempHeaderKey");
        apis_page.UDG_NEW_HEADER_VALUE_INPUT.setValue("tempHeaderValue");
        apis_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        wdioExpect(apis_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toExist();
        apis_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        apis_page.UDG_FIELD_MAPPING_PATH_INPUT.setValue(udgDetails.fieldMappingPath);
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).toExist();
        //Define GQL data source for a Query type field
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.gqlQuery).click();
        apis_page.UDG_CONFIGURE_EXTERNAL_GQL_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.gqlSource);
        apis_page.UDG_DATA_SOURCE_URL_INPUT.setValue(udgDetails.gqlDataSourceUrl);
        apis_page.UDG_ADD_HEADERS_CHECKBOX.check();
        apis_page.UDG_ADD_HEADER_BUTTON.click();
        apis_page.UDG_NEW_HEADER_KEY_INPUT.setValue(udgDetails.headerKey);
        apis_page.UDG_NEW_HEADER_VALUE_INPUT.setValue(udgDetails.headerValue);
        apis_page.getUDG_HEADER_DELETE_BY_POSITION_BUTTON(1).click();
        wdioExpect(apis_page.getUDG_HEADER_KEY_BY_POSITION_INPUT(2)).not.toExist();
        apis_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        apis_page.UDG_FIELD_MAPPING_PATH_INPUT.setValue(udgDetails.fieldMappingPath);
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.gqlQuery, udgDetails.gqlSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.gqlQuery, "GraphQL")).toExist();
        //Define Kafka data source for a Query type field
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.kafkaQuery).click();
        apis_page.UDG_CONFIGURE_EXTERNAL_KAFKA_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.kafkaSource);
        apis_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).setValue("tempBrokerAddress");
        apis_page.UDG_ADD_BROKER_ADDRESSES_BUTTON.click();
        apis_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(1).setValue("BrokerAddress");
        apis_page.getUDG_BROKER_ADDRESSES_DELETE_BY_POSITION_BUTTON(2).click();
        wdioExpect(apis_page.getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(2)).not.toExist();
        apis_page.getUDG_TOPICS_BY_POSITION_INPUT(1).setValue("tempTopic");
        apis_page.UDG_ADD_TOPICS_BUTTON.click();
        apis_page.getUDG_TOPICS_BY_POSITION_INPUT(1).setValue("BrokerAddress");
        apis_page.getUDG_TOPICS_DELETE_BY_POSITION_BUTTON(2).click();
        wdioExpect(apis_page.getUDG_TOPICS_BY_POSITION_INPUT(2)).not.toExist();
        apis_page.UDG_GROUP_ID_INPUT.setValue("GroupID");
        apis_page.UDG_CLIENT_ID_INPUT.setValue("ClientID");
        apis_page.UDG_KAFKA_VERSION_DROPDOWN.selectFirstOption();
        apis_page.UDG_BALANCE_STRATEGY_DROPDOWN.selectFirstOption();
        apis_page.UDG_START_CONSUMING_LATEST_CHECKBOX.check();
        apis_page.UDG_READ_COMMITTED_BUTTON.click();
        apis_page.UDG_ENABLE_SASL_CHECKBOX.check();
        apis_page.UDG_SASL_USER_INPUT.setValue("SaslUser");
        apis_page.UDG_SASL_PASSWORD_INPUT.setValue("SaslPassword");
        apis_page.UDG_DISABLE_FIELD_MAPPING_CHECKBOX.uncheck();
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.kafkaQuery, udgDetails.kafkaSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.kafkaQuery, "Kafka")).toExist();
    });

    it('User should be able to assign an existing data source to an object in an UDG API', () => {
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON(udgDetails.gqlType, udgDetails.gqlTypeField1).click();
        apis_page.UDG_EXPAND_DATA_SOURCES_ACCORDION.expand();
        apis_page.UDG_SELECT_DATA_SOURCE_OPEN_COMBOBOX.click();
        wdioExpect($(`//li//span[text()="${udgDetails.restSource}"]`)).toExist();
        wdioExpect($(`//li//span[text()="${udgDetails.gqlSource}"]`)).toExist();
        apis_page.UDG_COMBOBOX_FILTER_INPUT.setValue("gql");
        wdioExpect($(`//li//span[text()="${udgDetails.restSource}"]`)).not.toExist();
        apis_page.UDG_COMBOBOX_DROPDOWN.selectComboboxOption(udgDetails.gqlSource);
        wdioExpect(apis_page.UDG_DATA_SOURCE_CONNECTED_WARNING_MESSAGE).toExist();
        wdioExpect(apis_page.UDG_DATA_SOURCE_NAME_INPUT).toHaveValue(udgDetails.gqlSource);
        wdioExpect(apis_page.UDG_DATA_SOURCE_URL_INPUT).toHaveValue(udgDetails.gqlDataSourceUrl);
        wdioExpect(apis_page.UDG_FIELD_MAPPING_PATH_INPUT).toHaveValue(udgDetails.gqlTypeField1);
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME(udgDetails.gqlType, udgDetails.gqlTypeField1, udgDetails.gqlSource)).toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE(udgDetails.gqlType, udgDetails.gqlTypeField1, "GraphQL")).toExist();
    });

    it('User should be able to remove a data source from an object', () => {
        apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery).click();
        apis_page.UDG_DATA_SOURCE_RESET_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_SAVE_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_NAME("Query", udgDetails.restQuery, udgDetails.restSource)).not.toExist();
        wdioExpect(apis_page.getUDG_FIELD_DATA_SOURCE_LABEL_TYPE("Query", udgDetails.restQuery, "REST")).not.toExist();
    });

    it('User should be able to upload a schema file in a UDG API', () => {
        main_page.openAPIs();
        apis_page.ADD_NEW_API_BUTTON.click();
        apis_page.API_NAME_INPUT.setValue(udgDetails.fileUploadApiName);
        apis_page.API_TYPE_UDG_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.uploadSchemaFile(schemaFileRelativePath);
        apis_page.verifyFileUploadInSchemaEditor(schemaFileUploadVerificationArray);
        apis_page.SAVE_BUTTON.click();
        //Verify file upload again after saving API
        $apiTableElement = $(`span=${udgDetails.fileUploadApiName}`);
        $apiTableElement.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.verifyFileUploadInSchemaEditor(schemaFileUploadVerificationArray);
        wdioExpect(apis_page.getUDG_OPEN_FIELD_OPTIONS_BUTTON("Query", udgDetails.restQuery));
    });    
});