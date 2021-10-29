var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Webhooks_page extends Page {

get ADD_WEBHOOK() {return new Button_object('a*=Add Webhook');}
get NAME_INPUT() {return new Input_object('input[name="name"]');}
get REQUEST_METHOD_DROPDOWN() {return new DropDown_object('.tyk-select');}
get TARGET_INPUT() {return new Input_object('input[name="target_path"]');}
get HEADER_KEY() {return new Input_object('input[name="key"]');}
get HEADER_VALUE() {return new Input_object('input[name="value"]');}
get ADD_HEADER_BUTTON() {return new Button_object('span*=ADD');}
get SAVE_BUTTON() {return new Button_object('span*=Save');}
get UPDATE_BUTTON() {return new Button_object('span*=Update');}
get DELETE_BUTTON() {return new Button_object('span*=Delete');}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}

//Table 
get WEBHOOK_TABLE() {return new Table_object('.tyk-table');}
get NO_DATA_TO_DISPLAY() {return $('.tyk-message--info');}
}

export const webhook_page = new Webhooks_page();