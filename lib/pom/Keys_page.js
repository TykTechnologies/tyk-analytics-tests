var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');

class Keys_page extends Page {
get ADD_KEY_BUTTON() {return new Button_object('span*=Add Key')}; 
}
export const keys_page = new Keys_page();