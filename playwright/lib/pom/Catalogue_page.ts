import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';
import { Checkbox_object } from '@wrappers/Checkbox_object';
import { Table_object } from '@wrappers/Table_object';

export class Catalogue_page extends Template_Page {
//API Details tab
get API_DETAILS_TAB() { return new Button_object('button:text-is("API details")', this.page);}
get ADD_NEW_API_BUTTON() {return new Button_object('span:text-is("Add new API")', this.page);}
get PUBLIC_API_NAME_INPUT() {return new Input_object('input[name="name"]', this.page);}
get SELECT_POLICY_DROPDOWN() {return new DropDown_object('.tyk-combobox2__text-value', this.page);}
get DESCRIBE_THIS_API_INPUT() {return new Input_object('[placeholder="A really cool API that provides badger widgets"]', this.page);}
get CATALOGUE_OWNER_EMAIL_INPUT() {return new Input_object('input[name="config.email"]', this.page);}
get UPDATE_BUTTON() {return new Button_object('span:text-is("Update")', this.page);}
get SAVE_BUTTON() {return new Button_object('span:text-is("Save")', this.page);}

get DELETE_BUTTON() {return new Button_object('span:text-is("Delete")', this.page);}
get DELETE_KEY_MODAL() {return this.page.locator('.tyk-modal__content');}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]', this.page);}
get NO_APIS_REGISTERED_MESSAGE() {return this.page.locator('.tyk-message--info');}

//Settings tab
get OVERRIDE_GLOBAL_SETTINGS() {return new Checkbox_object('input[name="config.override"]', this.page);}
get REQUIRE_KEY_APPROVAL() {return new Checkbox_object('input[name="config.require_key_approval"]', this.page);}
get REDIRECT_KEY_REQUEST_CHECKBOX() {return new Checkbox_object('input[name="config.redirect_on_key_request"]', this.page);}
get SETTINGS_TAB_BUTTON() {return new Button_object('button:text-is("Settings")', this.page);}
get DEVELOPER_REQUEST_FORM_CUSTOMISATION() {return new Button_object('input[name="fieldName"]', this.page);}


//Custom fields section
get FIELD_NAME_INPUT() {return new Input_object('input[name="field_name"]', this.page);}
get FIELD_VALUE_INPUT() {return new Input_object('input[name="field_value"]', this.page);}
get ADD_BUTTON() {return new Button_object('span:text-is("ADD")', this.page);}


//Table
get CATALOGUE_TABLE() {return new Table_object('.tyk-table', this.page);}


}
