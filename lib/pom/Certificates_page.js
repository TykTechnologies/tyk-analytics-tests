var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Certificates_page extends Page{
//MAIN PAGE
get ADD_CERTIFICATE_BUTTON() {return new Button_object ('span*=Add Certificate');}
get FILTER_BY_CERTIFICATE_ID () {return new Input_object ('input[name="certID"]');}
get FILTER_BY_API () {return new DropDown_object ('span*=Search by API');}
get CERTIFICATES_TABLE () {return new Table_object ('.tyk-table');}
get ACTIONS_BUTTON() {return new Button_object ('span*=Actions');}
get ACTIONS_VIEW_BUTTON() {return new Button_object('span*=View');}
get ACTIONS_VIEW_DELETE() {return new Button_object('//div[contains(@class,"opened")]//li[2]//a//span[text()="Delete"]');}
get POPUP_CANCEL() {return new Button_object('span*=Cancel');}
get POPUP_DELETE() {return new Button_object ('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Delete"]');}
get REMOVED_CERT_MESSAGE_ALERT() {return $('span*=Certificate successfully deleted');}
get UPLOAD_ERROR_MESSAGE() {return $('.tyk-message__content')}




//CERTIFICATES IMPORT PAGE
get CHOOSE_FILE_BUTTON(){return new Button_object ('input[name="certificate"]');}
get UPLOAD_BUTTON(){return new Button_object ('span*=Upload');}

//CERTIFICATES DETAILS PAGE
get BACK_BUTTON() {return new Button_object('span*=Back');}
get ADD_NEW_CERTIFICATE() {return new Button_object('span*=Add new certificate');}
get DELETE_BUTTON() {return new Button_object('.tyk-button.tyk-button--danger.tyk-button--md');}
get ADDED_CERT_MESAGE_ALERT() {return $('span*=Certificate added');}


}
export const certs_page = new Certificates_page();