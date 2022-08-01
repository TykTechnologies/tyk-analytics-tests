var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
// var Table_object = require('ui_test_automation/wrappers/Table_object');
// var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
// var Input_object = require('ui_test_automation/wrappers/Input_object');

class Certificates_page extends Page{
//MAIN PAGE
get ADD_CERTIFICATE_BUTTON() {return new Button_object ('span*=Add Certificate');}

//CERTIFICATES IMPORT PAGE
get CHOOSE_FILE_BUTTON(){return new Button_object ('input[name="certificate"]');}
get UPLOAD_BUTTON(){return new Button_object ('span*=Upload');}
}


export const certs_page = new Certificates_page();