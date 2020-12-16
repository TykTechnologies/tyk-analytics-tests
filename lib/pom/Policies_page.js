var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Policies_page extends Page {
  //MAIN PAGE
  get ADD_POLICY_BUTTON() {return new Button_object('span*=Add Policy');}
  get POLICY_TABLE() {return new Table_object('.tyk-table');}
  
  //POLICY DETAILS PAGE
  get CONFIGURATIONS_TAB_BUTTON() {return new Button_object('button*=2.Configurations');}
  get CREATE_POLICY_BUTTON() {return new Button_object('span*=Create Policy');}
  get UPDATE_POLICY_BUTTON() {return new Button_object('span*=Update');}
  get DELETE_BUTTON() {return new Button_object('//button[contains(@class,"tyk-button--danger-outline")]//span[text()="Delete"]');}
  get API_TABLE() {return new Table_object('.tyk-table');}
  get NAME_INPUT() {return new Input_object('input[name="name"]');}
  get KEY_EXPIRY_AFTER_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value');}

  //MODALS
  get MODAL() {return $('.opened .tyk-modal__content');}
  get UPDATE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Update"]');}
  get DELETE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_POLICY_BUTTON);
  }
}
export const policies_page = new Policies_page();