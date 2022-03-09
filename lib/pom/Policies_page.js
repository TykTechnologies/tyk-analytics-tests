var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Policies_page extends Page {
  //MAIN PAGE
  get ADD_POLICY_BUTTON() {return new Button_object('span*=Add Policy');}
  get POLICY_TABLE() {return new Table_object('.tyk-table');}
  get NAME_SEARCH_INPUT() {return new Input_object('input[label="Search"]');}
  get ACCESS_RIGHTS_DROPDOWN() {return new DropDown_object('(//span[contains(@class,"tyk-combobox2__text-value")])[1]');}
  get AUTH_TYPES_DROPDOWN() {return new DropDown_object('(//span[contains(@class,"tyk-combobox2__text-value")])[2]');}
  
  //POLICY DETAILS PAGE
  get CONFIGURATIONS_TAB_BUTTON() {return new Button_object('button*=2.Configurations');}
  get CREATE_POLICY_BUTTON() {return new Button_object('span*=Create Policy');}
  get UPDATE_POLICY_BUTTON() {return new Button_object('span*=Update');}
  get DELETE_BUTTON() {return new Button_object('//button[contains(@class,"tyk-button--danger-outline")]//span[text()="Delete"]');}
  get API_SECTION_HEADER() {return new Button_object('h3=Add API Access Rights');}
  get API_NAME_INPUT() {return new Input_object('input[name="apiName"]');}
  get AUTHENTICATION_TYPE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value');}
  get API_TABLE() {return new Table_object('.tyk-table');}
  get NAME_INPUT() {return new Input_object('input[name="name"]');}
  get POLICY_STATE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__current-values');}
  get POLICY_STATE_DROPDOWN_ARROW() {return new DropDown_object('.tyk-combobox2__values-container-trigger');}
  get KEY_EXPIRY_AFTER_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value');}
  get MAIN_TAG_INPUT() {return new Input_object('input[name="inputTag"]');}
  get TAG_ADD_BUTTON() {return new Button_object('//input[@name="inputTag"]//following::span[text()="ADD"][1]');}
  get TAG_INPUT() {return new Input_object('//input[@name="inputTag"]//following::input[@name="inputTag"]');}
  get TAG_EDIT_BUTTON() {return new Button_object('//i[contains(@class, "fa-edit")]');}
  get TAG_UPDATE_BUTTON() {return new Button_object('//input[@name="inputTag"]//following::span[text()="Update"][1]');}
  get TAG_DELETE_BUTTON() {return new Button_object('//i[contains(@class, "fa-trash")]');}
  get TAG_LABEL() {return $('//input[@name="inputTag"]//following::div[1]');}
  get TAG_ELEMENTS() {return $('//ul[@class="tyk-editable-list-items inline tyk-editable-list-items--inline"]');}
  get MAIN_METADATA_KEY_INPUT() {return new Input_object('//input[@name="metaDataKey"]');}
  get MAIN_METADATA_VALUE_INPUT() {return new Input_object('//input[@name="metaDataValue"]');}
  get METADATA_ADD_BUTTON() {return new Button_object('//input[@name="metaDataValue"]//following::span[text()="ADD"][1]');}
  get METADATA_TABLE() {return $('//ul[@class="tyk-editable-list-items table"]');}
  get METADATA_EDIT_BUTTON() {return new Button_object('//i[contains(@class, "fa-edit")]');}
  get METADATA_KEY_INPUT() { return new Input_object('//input[@name="metaDataKey"]//following::input[@name="metaDataKey"]');}
  get METADATA_VALUE_INPUT() {return new Input_object('//input[@name="metaDataValue"]//following::input[@name="metaDataValue"]');} 
  get METADATA_UPDATE_BUTTON() {return new Button_object('//input[@name="metaDataValue"]//following::span[text()="Update"][1]');}
  get METADATA_DELETE_BUTTON() {return new Button_object('//i[contains(@class, "fa-trash")]');}

  //ERROR MESSAGES AND ICONS
  get API_ERROR_ICON() {return $('//span[text()="1. Access Rights"]//following::i[@class="tyk-icon fa fa-exclamation error-on-tab"][1]')};
  get CONFIG_ERROR_ICON() {return $('//span[text()="2.Configurations"]//following::i[@class="tyk-icon fa fa-exclamation error-on-tab"][1]')};
  get API_MANDATORY_TEXT() {return $('p=You need to add access rights to at least one API')};
  get NAME_MANDATORY_TEXT() {return $('p=Policy Name is a required field')};
  get EXPIRY_MANDATORY_TEXT() {return $('p=This field is required')};

  //MODALS
  get MODAL() {return $('.opened .tyk-modal__content');}
  get UPDATE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Update"]');}
  get DELETE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}
  get CONFIRM_BUTTON() {return $('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]');}

  get policy_created_expected_mesage() {return 'Policy has been successfully created';}
  get policy_updated_expected_mesage() {return 'Policy has been successfully updated';}

  isPolicyCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.policy_created_expected_mesage);}
  isPolicyUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.policy_updated_expected_mesage);}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_POLICY_BUTTON);
  }
}
export const policies_page = new Policies_page();