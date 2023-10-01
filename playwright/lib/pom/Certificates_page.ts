import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';
import { Table_object } from '@wrappers/Table_object';

class Certificates_page extends Template_Page{
//MAIN PAGE
get ADD_CERTIFICATE_BUTTON() {return new Button_object ('span*=Add Certificate', this.page);}
get FILTER_BY_CERTIFICATE_ID () {return new Input_object ('input[name="certID"]', this.page);}
get FILTER_BY_API () {return new DropDown_object ('span*=Search by API', this.page);}
get CERTIFICATES_TABLE () {return new Table_object ('.tyk-table', this.page);}
get ACTIONS_BUTTON() {return new Button_object ('span*=Actions', this.page);}
get ACTIONS_VIEW_BUTTON() {return new Button_object('span*=View', this.page);}
get ACTIONS_VIEW_DELETE() {return new Button_object('//div[contains(@class,"opened")]//li[2]//a//span[text()="Delete"]', this.page);}
get POPUP_CANCEL() {return new Button_object('span*=Cancel', this.page);}
get POPUP_DELETE() {return new Button_object ('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]', this.page);}
get REMOVED_CERT_MESSAGE_ALERT() {return $('span*=Certificate successfully deleted', this.page);}
get UPLOAD_ERROR_MESSAGE() {return $('.tyk-message__content', this.page)}




//CERTIFICATES IMPORT PAGE
get CHOOSE_FILE_BUTTON(){return new Button_object ('input[name="certificate"]', this.page);}
get UPLOAD_BUTTON(){return new Button_object ('span*=Upload', this.page);}

//CERTIFICATES DETAILS PAGE
get BACK_BUTTON() {return new Button_object('span*=Back', this.page);}
get ADD_NEW_CERTIFICATE() {return new Button_object('span*=Add new certificate', this.page);}
get DELETE_BUTTON() {return new Button_object('.tyk-button.tyk-button--danger.tyk-button--md', this.page);}
get ADDED_CERT_MESAGE_ALERT() {return $('span*=Certificate added', this.page);}


}