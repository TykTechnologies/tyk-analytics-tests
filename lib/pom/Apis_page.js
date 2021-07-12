var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');

class Apis_page extends Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() {return new Button_object('span*=Add new API');}
  get API_TABLE() {return $('.tyk-table');}
  
  //LANDING PAGE
  get IMPORT_API_BOX() {return $('h2*=Import API');}
  get DESIGN_API_BOX() {return $('h2*=Design new API');}
  get TRY_DEMO_BOX() {return $('h2*=Try demo API');}

  //OAS API PAGE
  get API_NAME_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]');}
  get OAS_GW_STATUS_DROPDOWN() {return new DropDown_object('//span[@title="Select status"]');}
  get OAS_API_REST_RADIO() {return new Button_object('//label[text()="REST"]');}
  get OAS_LISTEN_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.listenPath.value"]');}
  get OAS_AUTHENTICATION_DROPDOWN() {return new DropDown_object('//span[@title="Select authentication type"]');}
  get OAS_AUTH_KEY_HEADER_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.token.header.name"]');}
  get OAS_TARGET_URL_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.url"]');}
  get OAS_NEXT_BUTTON() {return new Button_object('//span[text()="Next"]');}
  get OAS_SEARCH_ICON() {return new Button_object('//i[contains(@class,"fa-search")]');}
  get OAS_SEARCH_BAR() {return new Input_object('//input[@name="search"]');}
  get OAS_SEARCH_BAR_CLOSE_ICON() {return new Button_object('//button[contains(@class, "search-input__close-btn")]');}
  get OAS_SEARCH_BAR_CLEAR_ICON() {return new Button_object('//input[@name="search"]//following::button[1]');}
  get OAS_HIDDEN_MATCH_MSG() {return $('//p[contains(@class, "hidden-search-results__message")]');}
  get OAS_SAVE_BUTTON() {return new Button_object('//button[@type="submit"]');}

  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() {return new Button_object('span*=Configure Api');}
  get SAVE_BUTTON() {return new Button_object('.//div[@class="tyk-fixed-wrapper "]//span[normalize-space() = "Save"]');}
  get OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS');}
  get DELETE_BUTTON() {return new Button_object('span=Delete');}

  //MODALS
  get MODAL() {return $('.tyk-modal__content');}
  get DELETE_API_BUTTON() {return this.MODAL.$('//button//span[text()="Delete API"]');}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }
}
export const apis_page = new Apis_page();