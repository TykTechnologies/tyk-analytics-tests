var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Tib_page extends Page {
    get CREATE_PROFILE_BUTTON() {return new Button_object('span*=Create Profile');}

}
export const tib_page = new Tib_page();