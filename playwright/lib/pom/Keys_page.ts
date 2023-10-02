import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { SlowButton_object } from '@wrappers/SlowButton_object';
import { Table_object } from '@wrappers/Table_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';
import { Checkbox_object } from '@wrappers/CheckBox_object';



export class Keys_page extends Template_Page {

get ADD_KEY_BUTTON() {return new Button_object(this.page.locator('span:text-is("Add Key")'), this.page);}
// get ADD_KEY_BUTTON() {return new Button_object(this.page.locator('span').filter({ hasText: 'Add Key' }), this.page);}
get CHOOSE_API_TOGGLE() {return new Button_object('span:text-is("Choose api")', this.page);}
get CHOOSE_API_TABLE() {return new Table_object('.tyk-table', this.page);}
get LOOKUP_KEY_BUTTON() {return new SlowButton_object('span:text-is("Lookup Key")', this.page);}
get KEY_SEARCH_FIELD() {return new Input_object('input[name="key"]', this.page);}
get UPDATE_BUTTON() {return new Button_object('span:text-is("Update")', this.page);}
get UPDATE_WITHOUT_QUOTA_RESET_BUTTON() {return new Button_object('span:text-is("Update without quota reset")', this.page);}
get DELETE_BUTTON() {return new Button_object('span:text-is("Delete")', this.page);}

//Configurations tab/page
get CONFIGURATIONS_TAB_BUTTON() {return new Button_object('button:text-is("2. Configurations")', this.page);}
get KEY_EXPIRE_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value', this.page);}
get ALIAS_INPUT_FIELD() {return new Input_object("//input[@name='alias']", this.page);}
get ENABLE_DETAILED_LOGGING_BUTTON() {return new Checkbox_object('.tyk-toggle__item', this.page);}
get CREATE_KEY_BUTTON() {return new SlowButton_object('span:text-is("Create Key")', this.page);}
get METADATA_KEY_INPUT() {return new Input_object('input[name=metaDataKey]', this.page);}
get METADATA_VALUE_INPUT() {return new Input_object('input[name=metaDataValue]', this.page);}
get METADATA_ADD_BUTTON() {return new Button_object('span:text-is("ADD")', this.page);}
get KEY_HASH_VALUE() {return this.page.locator('//span[@class="font-family-medium"]//span[text()="Key hash"]//following::button[1]');}
get KEY_ID_VALUE() {return this.page.locator('//span[@class="font-family-medium"]//span[text()="Key ID"]//following::button[1]');}

//Basic Authentication section
get AUTHENTICATION_BUTTON() {return new Button_object('button:text-is("3. Authentication")', this.page);} 
get AUTH_USERNAME() {return new Input_object('input[name="authentication.username"]', this.page);}
get AUTH_PASSWORD() {return new Input_object('input[name="authentication.password"]', this.page);}
get CREATE_NEW_PASSWORD_CHECKBOX() {return new Checkbox_object('.tyk-checkbox', this.page);}

//Key Successfully Generated modal 
get MODAL() {return this.page.locator('.opened .tyk-modal__content');}
//Copy icons inside Key sucessfully generated modal  
get COPY_KEY_HASH_BUTTON() {return new Button_object('//span/strong[text()="Key Hash "]//following::button[1]', this.page);};
get KEY_ID_BUTTON() {return new Button_object('//span/strong[text()="Key ID "]//following::button[1]', this.page);};
get COPY_KEY_ID_BUTTON() {return this.page.locator('.tyk-button--no-style').nth(1);}
get OK_BUTTON() {return new Button_object('span:text-is("OK")', this.page);}


//Update Key modal  
get UPDATE_KEY_MODAL() {return this.page.locator('.opened .tyk-modal__content');}
get CONFIRM_BUTTON() {return new Button_object('//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]', this.page);}
get CANCEL_BUTTON() {return new Button_object('//div[@class="tyk-modal__content"]//button//span[text()="Cancel"]', this.page);}
get DELETE_KEY_MODAL() {return this.page.locator('.tyk-modal__content');}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]', this.page);}


get key_updated_expected_message() {return 'Key has been successfully updated';}
get key_deleted_expected_message() {return 'Key has been successfully deleted';}
get key_created_expected_message() {return 'Key has been successfully created';}
get key_not_retrive_detail_message() {return 'Could not retrieve key detail';}

    async checkIfKeyUpdatedPopUpDisplayed() {return await this.checkIfSuccessPopupDisplayedWithText(this.key_updated_expected_message);}
    async checkIfKeyDeletedPopUpDisplayed() {return await this.checkIfSuccessPopupDisplayedWithText(this.key_deleted_expected_message);}
    async checkIfKeyCreatedPopUpDisplayed() {return await this.checkIfSuccessPopupDisplayedWithText(this.key_created_expected_message);}
    async isCouldNotRetrieveKeyDisplayed() {return await this.isErrorPopupDisplayedWithText(this.key_not_retrive_detail_message);}
}

