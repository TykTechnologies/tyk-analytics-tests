var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Checkbox_object = require('ui_test_automation/wrappers/Checkbox_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Users_page extends Page {
  //MAIN PAGE
  get ADD_USER_BUTTON() {return new Button_object('span*= Add user');}
  get USERS_TABLE() {return new Table_object('.tyk-table');}
  
  //ADD/EDIT USER PAGE
  get SAVE_BUTTON() {return new Button_object('span=Save');}
  get UPDATE_BUTTON() {return new Button_object('span=Update');}
  get DELETE_BUTTON() {return new Button_object('span=Delete');}
  get FIRST_NAME_INPUT() {return new Input_object('input[name="first_name"]');}
  get LAST_NAME_INPUT() {return new Input_object('input[name="last_name"]');}
  get EMAIL_ADRESS_INPUT() {return new Input_object('input[name="email_address"]');}
  get PASSWORD_INPUT() {return new Input_object('input[name="password"]');}
  get ACCOUNT_IS_ACTIVE_CHECKBOX() {return new Checkbox_object('input[name=active]');}
  get ACCOUNT_IS_ADMIN_CHECKBOX() {return new Checkbox_object('input[name=admin]');}
  get USER_GROUP_DROPDOWN() {return new Button_DropDown_object('.tyk-combobox2__text-value');}

  //MODALS
  get MODAL() {return $('.opened .tyk-modal__content');}
  get UPDATE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Update"]');}
  get DELETE_CONFIRMATION_BUTTON() {return $('//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}
  get CONFIRM_BUTTON() {return $('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]');}

  get user_created_expected_mesage() {return 'User added successfully';}
  get user_updated_expected_mesage() {return 'User updated successfully';}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_POLICY_BUTTON);
  }

  isUserCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.user_created_expected_mesage);}

  isUserUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.user_updated_expected_mesage);}
}
export const users_page = new Users_page();