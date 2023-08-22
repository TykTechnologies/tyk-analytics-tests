import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Table_object } from '@wrappers/Table_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';

export class Webhooks_page extends Template_Page {

get ADD_WEBHOOK() {return new Button_object('span*=Add Webhook', this.page);}
get NAME_INPUT() {return new Input_object('input[name="name"]', this.page);}
get REQUEST_METHOD_DROPDOWN() {return new DropDown_object('.tyk-select', this.page);}
get TARGET_INPUT() {return new Input_object('input[name="target_path"]', this.page);}
get HEADER_KEY() {return new Input_object('input[name="key"]', this.page);}
get HEADER_VALUE() {return new Input_object('input[name="value"]', this.page);}
get ADD_HEADER_BUTTON() {return new Button_object('span*=ADD', this.page);}
get SAVE_BUTTON() {return new Button_object('span*=Save', this.page);}
get UPDATE_BUTTON() {return new Button_object('span*=Update', this.page);}
get DELETE_BUTTON() {return new Button_object('span*=Delete', this.page);}
get DELETE_KEY_CONFIRMATION_BUTTON() {return new Button_object('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]', this.page);}

//Table 
get WEBHOOK_TABLE() {return new Table_object('.tyk-table', this.page);}
get NO_DATA_TO_DISPLAY() {return $('.tyk-message--info');}
}

export const webhook_page = new Webhooks_page();