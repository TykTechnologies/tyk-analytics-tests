var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');

class Policies_page extends Page {
  //MAIN PAGE
  get ADD_POLICY_BUTTON() {return new Button_object('span*=Add Policy');}
  get POLICY_TABLE() {return $('.tyk-table');}
  
  //ADD POLICY PAGE


  //MODALS
  get MODAL() {return $('.tyk-modal__content');}
  get DELETE_POLICY_BUTTON() {return this.MODAL.$('//button//span[text()="Delete API"]');}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_POLICY_BUTTON);
  }
}
export const policies_page = new Policies_page();