import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Input_object } from '@wrappers/Input_object';
import { DropDown_object } from '@wrappers/DropDown_object';
var Toggle_object = require('@wrappers/Toggle_object');
var Accordion_object = require('@wrappers/Accordion_object');
import { Checkbox_object } from '@wrappers/Checkbox_object';
const path = require('path');


export class Graphql_page extends Template_Page {
  get GRAPHQL_SCHEMA_TAB_BUTTON() { return new Button_object('button=Schema', this.page); }  
  get GRAPHQL_SUBGRAPHS_TAB_BUTTON() { return new Button_object('button=Subgraphs', this.page); }
  get GRAPHQL_UPDATE_SCHEMA_BUTTON() { return new Button_object('//span[@class="schema-message-button"]//span[text()="UPDATE"]', this.page); }
  get GRAPHQL_ENABLE_PLAYGROUND_TOGGLE() { return new Toggle_object('span=Enable Playground'); }  
  getFEDERATION_SUBGRAPHS_LIST_PANEL(subgraphName) {
    return new Button_object(`//div[@class="supergraph-panels"]//h3[text()="${subgraphName}"]`);
  }
  getFEDERATION_REMOVE_SUBGRAPH_BUTTON(subgraphName) {
    return new Button_object(`//h3[text()="${subgraphName}"]//button[@id="removeSubgraph"]`);
  }
  get FEDERATION_REMOVE_SUBGRAPH_CONFIRM_CHECKBOX() { return new Checkbox_object('//input[@name="remove subgraph"]', this.page); }
  get FEDERATION_REMOVE_SUBGRAPH_MODAL_BUTTON() { return new Button_object('button=Remove Subgraph', this.page); }
  get GRAPHQL_SUBGRAPHS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.graphql.superGraph.subgraphs"]//div[@class="tyk-form-control"]') }
  get FEDERATION_ADD_SUBGRAPH_BUTTON() { return new Button_object('button=Add Subgraph', this.page); }
  get FEDERATION_ADD_SUBGRAPH_DROPDOWN() { return new DropDown_object('//label[text()="Select subgraph"]//following-sibling::div//div[@class="tyk-form-control"]', this.page); }
  get FEDERATION_ADD_BUTTON() { return new Button_object('button=Add', this.page); }
  get UDG_IMPORT_SCHEMA_FILE_FIELD() { this.page.locator('//div[@class="tyk-file-input__wrapper"]//input[@label="Import File"]'); }
  getUDG_OPEN_FIELD_OPTIONS_BUTTON(type, field) {
    return new Button_object(`//h3[@class="section-title" and text()="Type | "]//descendant::span[@class="field-name" and text()="${type}"]//ancestor::div[1]//descendant::label[text()="${field}"]`);
  }
  getUDG_FIELD_DATA_SOURCE_LABEL_NAME(type, field, dataSourceName) {
    return $(`//h3[@class="section-title" and text()="Type | "]//descendant::span[@class="field-name" and text()="${type}"]//ancestor::div[1]//descendant::label[text()="${field}"]//parent::div//following-sibling::div//p[text()="${dataSourceName}"]`);
  }
  getUDG_FIELD_DATA_SOURCE_LABEL_TYPE(type, field, dataSourceType) {
    return $(`//h3[@class="section-title" and text()="Type | "]//descendant::span[@class="field-name" and text()="${type}"]//ancestor::div[1]//descendant::label[text()="${field}"]//parent::div//following-sibling::div//strong[text()="${dataSourceType}"]`);
  }
  get UDG_EXPAND_DATA_SOURCES_ACCORDION() { return new Accordion_object('//span[text()="Data Sources | Tyk"]//following-sibling::div'); }
  get UDG_EXPAND_REST_TYK_ACCORDION() { return new Accordion_object('//span[text()="REST | Tyk"]//following-sibling::div[@class="collapsable__arrow-left"]'); }
  get UDG_EXPAND_GRAPHQL_TYK_ACCORDION() { return new Accordion_object('//span[text()="GraphQL | Tyk"]//following-sibling::div[@class="collapsable__arrow-left"]'); }
  get UDG_SELECT_DATA_SOURCE_OPEN_COMBOBOX() { return new Button_object('//span[@title="Select Data Source"]', this.page); }
  get UDG_SELECT_REST_API_OPEN_COMBOBOX() { return new Button_object('//span[text()="REST | Tyk"]//ancestor::div[2]//descendant::span[@title="Select API"]', this.page); }
  get UDG_SELECT_GRAPHQL_API_OPEN_COMBOBOX() { return new Button_object('//span[text()="GraphQL | Tyk"]//ancestor::div[2]//descendant::span[@title="Select API"]', this.page); }
  get UDG_COMBOBOX_FILTER_INPUT() { return new Input_object('//div[@class="tyk-combobox2__combobox-search"]//input', this.page); }
  get UDG_COMBOBOX_DROPDOWN() { return new DropDown_object('//ul[@class="tyk-combobox2__combobox-list"]', this.page); }
  get UDG_DATA_SOURCE_CONNECTED_WARNING_MESSAGE() { this.page.locator('//div[@class="tyk-message__content" and contains(text(),"This data source is connected to multiple fields.")]'); }
  get UDG_CONFIGURE_EXTERNAL_REST_BUTTON() { return new Button_object('span=REST', this.page); }
  get UDG_CONFIGURE_EXTERNAL_GQL_BUTTON() { return new Button_object('span=GRAPHQL', this.page); }
  get UDG_CONFIGURE_EXTERNAL_KAFKA_BUTTON() { return new Button_object('span=KAFKA', this.page); }
  get UDG_DATA_SOURCE_NAME_INPUT() { return new Input_object('//input[@label="Data source name"]', this.page); }
  get UDG_DATA_SOURCE_URL_INPUT() { return new Input_object('//textarea[@placeholder="Enter data source url"]', this.page); }
  get UDG_DATA_SOURCE_ENDPOINT_INPUT() { return new Input_object('//textarea[@placeholder="Enter endpoint"]', this.page); }
  get UDG_TEMPLATING_SYNTAX_FILTER() { return new Input_object('//input[@class="tyk-form-control" and @placeholder="Search parameter"]') }
  get UDG_TEMPLATING_SYNTAX_HINT_LIST() { return new DropDown_object('//ul[@class="string-builder-list"]', this.page); }
  get UDG_DATA_SOURCE_METHOD() { return new DropDown_object('//label[text()="Method"]//following::div[1]//child::div', this.page); }
  get UDG_ADD_HEADERS_CHECKBOX() { return new Checkbox_object('//label[text()="Add headers"]//child::input', this.page); }
  get UDG_ADD_HEADER_BUTTON() { return new Button_object('span=Add', this.page); }
  get UDG_NEW_HEADER_KEY_INPUT() { return new Input_object('//ul[@class="editable-list__list"]//li[position() = last() - 1]//div[1]//input', this.page); }
  get UDG_NEW_HEADER_VALUE_INPUT() { return new Input_object('//ul[@class="editable-list__list"]//li[position() = last() - 1]//div[2]//input', this.page); }
  getUDG_HEADER_KEY_BY_POSITION_INPUT(positionFromTop) {
    return new Input_object(`//ul[@class="editable-list__list"]//li[position() = last() - ${positionFromTop}]//div[1]//input`);
  }
  getUDG_HEADER_VALUE_BY_POSITION_INPUT(positionFromTop) {
    return new Input_object(`//ul[@class="editable-list__list"]//li[position() = last() - ${positionFromTop}]//div[2]//input`);
  }
  getUDG_HEADER_DELETE_BY_POSITION_BUTTON(positionFromTop) {
    return new Button_object(`//ul[@class="editable-list__list"]//li[position() = last() - ${positionFromTop}]//div[3]//button`);
  }
  get UDG_DISABLE_FIELD_MAPPING_CHECKBOX() { return new Checkbox_object('//h4[text()="Field mapping"]//following::div[1]//input', this.page); }
  get UDG_FIELD_MAPPING_PATH_INPUT() { return new Input_object('//input[@placeholder="Enter path"]', this.page); }
  get UDG_ADD_BROKER_ADDRESSES_BUTTON() { return new Button_object('//label[text()="Broker addresses"]//following-sibling::button//span', this.page); }
  getUDG_BROKER_ADDRESSES_BY_POSITION_INPUT(positionFromTop) {
    return new Input_object(`//label[text()="Broker addresses"]//parent::div//following-sibling::ul//li[position() = last() - ${positionFromTop}]//div[1]//input`);
  }
  getUDG_BROKER_ADDRESSES_DELETE_BY_POSITION_BUTTON(positionFromTop) {
    return new Input_object(`//label[text()="Broker addresses"]//parent::div//following-sibling::ul//li[position() = last() - ${positionFromTop}]//div[2]//button`);
  }
  get UDG_ADD_TOPICS_BUTTON() { return new Button_object('//label[text()="Topics"]//following-sibling::button//span', this.page); }
  getUDG_TOPICS_BY_POSITION_INPUT(positionFromTop) {
    return new Input_object(`//label[text()="Topics"]//parent::div//following-sibling::ul//li[position() = last() - ${positionFromTop}]//div[1]//input`);
  }
  getUDG_TOPICS_DELETE_BY_POSITION_BUTTON(positionFromTop) {
    return new Input_object(`//label[text()="Topics"]//parent::div//following-sibling::ul//li[position() = last() - ${positionFromTop}]//div[2]//button`);
  }
  get UDG_GROUP_ID_INPUT() { return new Input_object('//input[@placeholder="Enter group ID"]', this.page); }
  get UDG_CLIENT_ID_INPUT() { return new Input_object('//input[@placeholder="Enter client ID"]', this.page); }
  get UDG_KAFKA_VERSION_DROPDOWN() { return new DropDown_object('//label[text() = "Kafka Version"]//following-sibling::div//div[@class="tyk-form-control"]', this.page); }
  get UDG_BALANCE_STRATEGY_DROPDOWN() { return new DropDown_object('//label[text() = "Balance strategy"]//following-sibling::div//div[@class="tyk-form-control"]', this.page); }
  get UDG_START_CONSUMING_LATEST_CHECKBOX() { return new Checkbox_object('label=Start consuming latest', this.page); }
  get UDG_READ_COMMITTED_BUTTON() { return new Button_object('label=Read committed', this.page); }
  get UDG_READ_UNCOMMITTED_BUTTON() { return new Button_object('label=Read un-committed', this.page); }
  get UDG_ENABLE_SASL_CHECKBOX() { return new Checkbox_object('label=Enable SASL', this.page); }
  get UDG_SASL_USER_INPUT() { return new Input_object('//input[@label="User"]', this.page); }
  get UDG_SASL_PASSWORD_INPUT() { return new Input_object('//input[@label="Password"]', this.page); }
  get UDG_DATA_SOURCE_RESET_BUTTON() { return new Button_object('span=Reset', this.page); }
  get UDG_DATA_SOURCE_SAVEANDUPDATE_BUTTON() { return new Button_object('span=Save and Update API', this.page); }

  uploadSchemaFile(schemaFileRelativePath) {
    const filePath = path.join(__dirname, schemaFileRelativePath);
    console.log(`>>> Uploading schema file from path: ${filePath}`);
    const remoteFilePath = browser.uploadFile(filePath);    
    await this.UDG_IMPORT_SCHEMA_FILE_FIELD.fill(remoteFilePath);
  };

  verifySchemaEditorContents(verificationArray, schemaEditorXpath) {
    verificationArray.forEach((line, lineIndex) => {
      line.forEach(word => {
        await assert($(`${schemaEditorXpath}//child::div[${lineIndex + 1}]//span[contains(@class,"mtk") and text()='${word}']`)).toBeDisplayed();
        // await assert($(`//div[@class="view-lines monaco-mouse-cursor-text"]//child::div[${lineIndex + 1}]//span[contains(@class,"mtk") and text()="${word}"]`)).toBeDisplayed();
      });
    });
  }

  keys(value) {
    const arrValue = [...value]; //convert string to charArray
    arrValue.forEach(e => {
      browser.keys(e);
      browser.pause(200);
    });
  }

}

export const graphql_page = new Graphql_page();