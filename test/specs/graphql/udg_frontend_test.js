import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';

describe('UDG with REST and GQL datasources', () => {
    const apiDetails = {
        name: "UDG-RestAndGql"
    };
    const udgDetails = {
        restQuery: "restQuery",
        restType: "RestType",
        restSource: "restSource",
        headerKey: "someHeader",
        headerValue: "someHeaderValue",
        gqlQuery: "GqlQuery",
        gqlType: "GqlType",
        gqlSource: "GqlSource",
        customType: "CustomType",
        customField: "CustomField",
        restDataSourceUrl: "https://swapi.dev/api/people/{",
        expectedFullRestDataSourceUrl: "https://swapi.dev/api/people/{{.object.default}}",
        gqlDataSourceUrl: "https://countries.trevorblades.com/"
    };
    let $apiTableElement;

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });

    it('User should be able to create a UDG API with REST and GraphQL datasources and create UDG objects and fields', () => {
        main_page.openAPIs();
        apis_page.DESIGN_API_BOX.click();
        apis_page.API_NAME_INPUT.setValue(apiDetails.name);
        apis_page.API_TYPE_UDG_BUTTON.click();
        apis_page.CONFIGURE_API_BUTTON.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.UDG_DATA_SOURCES_MODE_BUTTON.click();
        //Add UDG object
        apis_page.UDG_ADD_OBJECT_BUTTON.click();
        //"Input" put here due to a bug that would make the page disappear if "Type" was selected right away
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Input");
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Type");
        apis_page.UDG_OBJECT_NAME_INPUT.setValue(udgDetails.restType);
        apis_page.UDG_CREATE_UPDATE_OBJECT_BUTTON.click();
        //Define REST data source for existing Query type field
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", "default").click();
        apis_page.UDG_DATA_SOURCE_TAB_BUTTON.click();
        apis_page.UDG_DEFINE_DATASOURCES_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_TYPE_DROPDOWN.selectOption("REST");
        apis_page.UDG_DATA_SOURCE_URL_INPUT.setValue(udgDetails.restDataSourceUrl);
        apis_page.UDG_TEMPLATING_SYNTAX_HINT.selectOption("default");
        wdioExpect(apis_page.UDG_DATA_SOURCE_URL_INPUT).toHaveText(udgDetails.expectedFullRestDataSourceUrl);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.restSource);
        apis_page.UDG_DATA_SOURCE_METHOD.selectOption("GET");
        apis_page.UDG_HEADERS_KEY_INPUT.setValue(udgDetails.headerKey);
        apis_page.UDG_HEADERS_VALUE_INPUT.setValue(udgDetails.headerValue);
        //Update object
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Type");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption(udgDetails.restType);
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.restQuery);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
        //Add another UDG object
        apis_page.UDG_ADD_OBJECT_BUTTON.click();
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Input");
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Type");
        apis_page.UDG_OBJECT_NAME_INPUT.setValue(udgDetails.gqlType);
        apis_page.UDG_CREATE_UPDATE_OBJECT_BUTTON.click();
        //Add yet another UDG object
        apis_page.UDG_ADD_OBJECT_BUTTON.click();
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Input");
        apis_page.UDG_OBJECT_TYPE_DROPDOWN.selectOption("Type");
        apis_page.UDG_OBJECT_NAME_INPUT.setValue(udgDetails.customType);
        apis_page.UDG_CREATE_UPDATE_OBJECT_BUTTON.click();
        //Add field to freshly added object
        apis_page.getUDG_FIELD_OBJECT_BUTTON(udgDetails.customType, "Fields").click();
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Scalars");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption("String");
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.customField);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
        //Add a Query type field with GQL data source
        apis_page.getUDG_FIELD_OBJECT_BUTTON("Query", "Fields").click();
        apis_page.UDG_DEFINE_DATASOURCES_BUTTON.click();
        apis_page.UDG_DATA_SOURCE_TYPE_DROPDOWN.selectOption("GraphQL");
        apis_page.UDG_DATA_SOURCE_URL_INPUT.setValue(udgDetails.gqlDataSourceUrl);
        apis_page.UDG_DATA_SOURCE_NAME_INPUT.setValue(udgDetails.gqlSource);
        apis_page.UDG_HEADERS_KEY_INPUT.setValue(udgDetails.headerKey);
        apis_page.UDG_HEADERS_VALUE_INPUT.setValue(udgDetails.headerValue);
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN.selectOption("Type");
        apis_page.UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN.selectOption(udgDetails.gqlType);
        apis_page.UDG_DATA_MODEL_NAME_INPUT.setValue(udgDetails.gqlQuery);
        apis_page.UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON.click();
        apis_page.SAVE_BUTTON.click();
    });

    it('User should be able to delete a UDG object field', () => {
        $apiTableElement = $(`span=${apiDetails.name}`);
        $apiTableElement.click();
        apis_page.GRAPHQL_SCHEMA_TAB_BUTTON.click();
        apis_page.UDG_DATA_SOURCES_MODE_BUTTON.click();
        apis_page.UDG_FILTER_BY_NAME_INPUT.setValue(udgDetails.customField);
        apis_page.getUDG_FIELD_OBJECT_BUTTON(udgDetails.customType, udgDetails.customField).click();
        apis_page.UDG_DATA_MODEL_TAB_BUTTON.click();
        apis_page.UDG_DELETE_FIELD_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(apis_page.getUDG_FIELD_OBJECT_BUTTON(udgDetails.customType, udgDetails.customField)).not.toExist();
    });

    it('User should be able to delete a UDG object', () => {
        apis_page.UDG_FILTER_BY_NAME_INPUT.clear();
        apis_page.UDG_FILTER_BY_TYPE_INPUT.selectOption("Type");
        apis_page.getUDG_EDIT_OBJECT_BUTTON(udgDetails.customType).click();
        apis_page.UDG_DELETE_OBJECT_BUTTON.click();
        apis_page.CONFIRM_BUTTON.click();
        wdioExpect(apis_page.getUDG_EDIT_OBJECT_BUTTON(udgDetails.customType)).not.toExist();
    });

});