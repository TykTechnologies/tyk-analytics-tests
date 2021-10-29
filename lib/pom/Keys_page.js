var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var Checkbox_object = require('ui_test_automation/wrappers/Checkbox_object');



class Keys_page extends Page {

get ADD_KEY_BUTTON() {return new Button_object('span*=Add Key');}
get CHOOSE_API_TOGGLE() {return new Button_object('span*=Choose api');}
get CHOOSE_API_TABLE() {return new Table_object('.tyk-table');}
get LOOKUP_KEY_BUTTON() {return new Button_object('span*=Lookup Key');}
get KEY_SEARCH_FIELD() {return new Input_object('input[name="key"]');}
get UPDATE_BUTTON() {return new Button_object('span*=Update');}
get UPDATE_WITHOUT_QUOTA_RESET_BUTTON() {return new Button_object('span*=Update without quota reset');}
get DELETE_BUTTON() {return new Button_object('span*=Delete');}

//Configurations tab/page
get CONFIGURATIONS_TAB_BUTTON() {return new Button_object('button*=2. Configurations');}
get KEY_EXPIRE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value');}
get ALIAS_INPUT_FIELD() {return new Input_object("//input[@name='alias']");}
get ENABLE_DETAILED_LOGGING_BUTTON() {return new Checkbox_object('.tyk-toggle__item');}
get CREATE_KEY_BUTTON() {return new Button_object('span*=Create Key');}
get METADATA_KEY_INPUT() {return new Input_object('input[name=metaDataKey]');}
get METADATA_VALUE_INPUT() {return new Input_object('input[name=metaDataValue]');}
get METADATA_ADD_BUTTON() {return new Button_object('span*=ADD');}
get KEY_HASH_VALUE() {return $('//span[@class="font-family-medium"]//span[text()="Key hash"]//following::button[1]');}
get KEY_ID_VALUE() {return $('//span[@class="font-family-medium"]//span[text()="Key ID"]//following::button[1]');}

//Basic Authentication section
get AUTHENTICATION_BUTTON() {return new Button_object('button*=3. Authentication');} 
get AUTH_USERNAME() {return new Input_object('input[name="authentication.username"]');}
get AUTH_PASSWORD() {return new Input_object('input[name="authentication.password"]');}
get CREATE_NEW_PASSWORD_CHECKBOX() {return new Checkbox_object('.tyk-checkbox');}

//Key Successfully Generated modal 
get MODAL() {return $('.opened .tyk-modal__content');}
//Copy icons inside Key sucessfully generated modal  
get COPY_KEY_HASH_BUTTON() {return new Button_object('//span/strong[text()="Key Hash "]//following::button[1]');};
get KEY_ID_BUTTON() {return new Button_object('//span/strong[text()="Key ID "]//following::button[1]');};
get COPY_KEY_ID_BUTTON() {return $$('.tyk-button--no-style')[1];}
get OK_BUTTON() {return new Button_object('span*=OK');}


//Update Key modal  
get UPDATE_KEY_MODAL() {return $('.opened .tyk-modal__content');}
get CONFIRM_BUTTON() {return new Button_object('//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]');}
get CANCEL_BUTTON() {return new Button_object('//div[@class="tyk-modal__content"]//button//span[text()="Cancel"]');}
get DELETE_KEY_MODAL() {return $('.tyk-modal__content');}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]');}


get key_updated_expected_message() {return 'Key has been successfully updated';}
get key_deleted_expected_message() {return 'Key has been successfully deleted';}
get key_created_expected_message() {return 'Key has been successfully created';}
get key_not_retrive_detail_message() {return 'Could not retrieve key detail';}

isKeyUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.key_updated_expected_message);}
isKeyDeletedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.key_deleted_expected_message);}
isKeyCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.key_created_expected_message);}
isCouldNotRetrieveKeyDisplayed() {return this.isErrorPopupDisplayedWithText(this.key_not_retrive_detail_message);}
}
export const keys_page = new Keys_page();

