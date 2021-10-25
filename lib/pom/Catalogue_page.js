var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var Checkbox_object = require('ui_test_automation/wrappers/Checkbox_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');

class Catalogue_page extends Page {
//API Details tab
get API_DETAILS_TAB() { return new Button_object('button*=API details');}
get ADD_NEW_API_BUTTON() {return new Button_object('span*=Add new API');}
get PUBLIC_API_NAME_INPUT() {return new Input_object('input[name="name"]');}
get SELECT_POLICY() {return new DropDown_object('.tyk-combobox2__text-value');}
get DESCRIBE_THIS_API() {return new Input_object('[placeholder="A really cool API that provides badger widgets"]');}
get CATALOGUE_OWNER_EMAIL_INPUT() {return new Input_object('input[name="config.email"]');}
get UPDATE_BUTTON() {return new Button_object('span*=Update');}
get SAVE_BUTTON() {return new Button_object('span*=Save');}

get DELETE_BUTTON() {return new Button_object('span*=Delete');}
get DELETE_KEY_MODAL() {return $('.tyk-modal__content');}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}
get NO_APIS_REGISTERED_MESSAGE() {return $('.tyk-message--info');}

//Settings tab
get OVERRIDE_GLOBAL_SETTINGS() {return new Checkbox_object('input[name="config.override"]');}
get REQUIRE_KEY_APPROVAL() {return new Checkbox_object('input[name="config.require_key_approval"]');}
get REDIRECT_KEY_REQUEST_CHECKBOX() {return new Checkbox_object('input[name="config.redirect_on_key_request"]');}
get SETTINGS_TAB_BUTTON() {return new Button_object('button*=Settings');}
get DEVELOPER_REQUEST_FORM_CUSTOMISATION() {return new Button_object('input[name="fieldName"]');}


//Custom fields section
get FIELD_NAME_INPUT() {return new Input_object('input[name="field_name"]');}
get FIELD_VALUE_INPUT() {return new Input_object('input[name="field_value"]');}
get ADD_BUTTON() {return new Button_object('span*=ADD');}


//Table
get CATALOGUE_TABLE() {return new Table_object('.tyk-table');}


}

export const catalogue_page = new Catalogue_page();
