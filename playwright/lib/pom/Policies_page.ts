import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Table_object } from '@wrappers/Table_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';
import { SlowButton_object } from 'tyk-test-automation-wrappers/lib/SlowButton_object';

export class Policies_page extends Template_Page {
  //MAIN PAGE
  get ADD_POLICY_BUTTON() {return new Button_object('span:text-is("Add Policy")', this.page);}
  get POLICY_TABLE() {return new Table_object('.tyk-table', this.page);}
  get NAME_SEARCH_INPUT() {return new Input_object('input[label="Search"]', this.page);}
  get ACCESS_RIGHTS_DROPDOWN() {return new DropDown_object("//div[@name='apis']//span", this.page);}
  get AUTH_TYPES_DROPDOWN() {return new DropDown_object("//div[@name='auth_type']//span", this.page);}
  
  //POLICY DETAILS PAGE
  get CONFIGURATIONS_TAB_BUTTON() {return new Button_object('button:text-is("2.Configurations")', this.page);}
  get CREATE_POLICY_BUTTON() {return new SlowButton_object('span:text-is("Create Policy")', this.page);}
  get UPDATE_POLICY_BUTTON() {return new Button_object('span:text-is("Update")', this.page);}
  get DELETE_BUTTON() {return new Button_object('//button[contains(@class,"tyk-button--danger-outline")]//span[text()="Delete"]', this.page);}
  get API_SECTION_HEADER() {return new SlowButton_object('h3:text("Add API Access Rights")', this.page);}
  get API_NAME_INPUT() {return new Input_object('input[name="apiName"]', this.page);}
  get AUTHENTICATION_TYPE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value', this.page);}
  get API_TABLE() {return new Table_object('.tyk-table', this.page);}
  get NAME_INPUT() {return new Input_object('input[name="name"]', this.page);}
  get POLICY_STATE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__current-values', this.page);}
  get KEY_EXPIRY_AFTER_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value', this.page);}
  get MAIN_TAG_INPUT() {return new Input_object('input[name="inputTag"]', this.page);}
  get TAG_ADD_BUTTON() {return new Button_object('//input[@name="inputTag"]//following::span[text()="ADD"][1]', this.page);}
  get TAG_INPUT() {return new Input_object('//input[@name="inputTag"]//following::input[@name="inputTag"]', this.page);}
  get TAG_EDIT_BUTTON() {return new Button_object('//i[contains(@class, "fa-edit")]', this.page);}
  get TAG_UPDATE_BUTTON() {return new Button_object('//input[@name="inputTag"]//following::span[text()="Update"][1]', this.page);}
  get TAG_DELETE_BUTTON() {return new Button_object('//i[contains(@class, "fa-trash")]', this.page);}
  get TAG_LABEL() {return this.page.locator('//input[@name="inputTag"]//following::div[1]');}
  get TAG_ELEMENTS() {return this.page.locator('//ul[@class="tyk-editable-list-items inline tyk-editable-list-items--inline"]');}
  get MAIN_METADATA_KEY_INPUT() {return new Input_object('//input[@name="metaDataKey"]', this.page);}
  get MAIN_METADATA_VALUE_INPUT() {return new Input_object('//input[@name="metaDataValue"]', this.page);}
  get METADATA_ADD_BUTTON() {return new Button_object('//input[@name="metaDataValue"]//following::span[text()="ADD"][1]', this.page);}
  get METADATA_TABLE() {return this.page.locator('//ul[@class="tyk-editable-list-items table"]');}
  get METADATA_EDIT_BUTTON() {return new Button_object('//i[contains(@class, "fa-edit")]', this.page);}
  get METADATA_KEY_INPUT() { return new Input_object('//input[@name="metaDataKey"]//following::input[@name="metaDataKey"]', this.page);}
  get METADATA_VALUE_INPUT() {return new Input_object('//input[@name="metaDataValue"]//following::input[@name="metaDataValue"]', this.page);} 
  get METADATA_UPDATE_BUTTON() {return new Button_object('//input[@name="metaDataValue"]//following::span[text()="Update"][1]', this.page);}
  get METADATA_DELETE_BUTTON() {return new Button_object('//i[contains(@class, "fa-trash")]', this.page);}

  //ERROR MESSAGES AND ICONS
  get API_ERROR_ICON() {return this.page.locator('//span[text()="1. Access Rights"]//following::i[@class="tyk-icon fa fa-exclamation error-on-tab"][1]')};
  get CONFIG_ERROR_ICON() {return this.page.locator('//span[text()="2.Configurations"]//following::i[@class="tyk-icon fa fa-exclamation error-on-tab"][1]')};
  get API_MANDATORY_TEXT() {return this.page.locator('p').filter({ hasText: 'You need to add access rights to at least one API' })};
  get NAME_MANDATORY_TEXT() {return this.page.locator('p').filter({ hasText: 'Policy Name is a required field' })};
  get EXPIRY_MANDATORY_TEXT() {return this.page.locator('p').filter({ hasText: 'This field is required' })};

  //MODALS
  get MODAL() {return this.page.locator('.opened .tyk-modal__content');}
  get UPDATE_CONFIRMATION_BUTTON() {return this.page.locator('//div[@class="tyk-modal__content"]//button//span[text()="Update"]');}
  get DELETE_CONFIRMATION_BUTTON() {return this.page.locator('//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}
  get CONFIRM_BUTTON() {return this.page.locator('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]');}

  get policy_created_expected_mesage() {return 'Policy has been successfully created';}
  get policy_updated_expected_mesage() {return 'Policy has been successfully updated';}

  isPolicyCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.policy_created_expected_mesage);}
  isPolicyUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.policy_updated_expected_mesage);}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_POLICY_BUTTON);
  }
}