var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');

class Apis_page extends Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() {return new Button_object('span*=Add new API');}
  get API_TABLE() {return $('.tyk-table');}
  
  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() {return new Button_object('span*=Configure Api');}
  get SAVE_BUTTON() {return new Button_object('.//div[@class="tyk-fixed-wrapper "]//span[normalize-space() = "Save"]');}
  get OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS');}
  get DELETE_BUTTON() {return new Button_object('span=Delete');}

  //MODALS
  get MODAL() {return $('.tyk-modal__content');}
  get DELETE_API_BUTTON() {return this.MODAL.$('//button//span[text()="Delete API"]');}

  get API_NAME_INPUT() {return $('input[name="api_definition.name"]');}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }
}
export const apis_page = new Apis_page();