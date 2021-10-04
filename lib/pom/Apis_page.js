var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Toggle_object = require('ui_test_automation/wrappers/Toggle_object');

class Apis_page extends Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() {return new Button_object('span*=Add new API');}
  get API_TABLE() {return $('.tyk-table');}
  
  //LANDING PAGE
  get IMPORT_API_BOX() {return $('h2*=Import API');}
  get DESIGN_API_BOX() {return new Button_object('h2*=Design new API');}
  get TRY_DEMO_BOX() {return $('h2*=Try demo API');}

  //OAS SIDE MENU
  get SIDE_MENU_BASE_LINK() {return $('//span[text()="Base"]');}
  get SIDE_MENU_MIDDLEWARE_LINK() {return $('//span[text()="Middleware"]');}

  //OAS API PAGE
  get EDIT_BUTTON() {return new Button_object('span*=Edit')}
  get OAS_API_NAME_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]');}
  get API_NAME_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]');}
  get OAS_GW_STATUS_DROPDOWN() {return new DropDown_object('//span[@title="Select status"]');}
  get OAS_ACCESS_DROPDOWN() {return new DropDown_object('//span[@title="Select access"]');}
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

  //OAS CORS FIELDS
  get OAS_ENABLE_CORS_TOGGLE() {return new Toggle_object('//label[text()="Enable CORS"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_OPTIONS_PASS_THROUGH_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.optionsPassthrough"]');}
  get OAS_ALLOW_CREDENTIALS_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.allowCredentials"]');}
  get OAS_DEBUG_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.debug"]');}
  get OAS_MAX_AGE_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cors.maxAge"]');}
  get OAS_ALLOWED_METHODS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedMethods"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOWED_ORIGINS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedOrigins"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOWED_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_EXPOSED_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.exposedHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOW_ALL_ORIGINS_BOX() {return $('//label[contains(text(),"Allow All Origins")]//input');}
  get OAS_ALLOW_ALL_HEADERS_BOX() {return $('//label[contains(text(),"Allow All Headers")]//input');}
  get OAS_MAX_AGE_SAVED() {return $('//span[text()="Max Age (seconds)"]//following::p[1]');}
  get OAS_ALLOWED_METHODS_SAVED() {return $('//span[text()="Allowed Methods"]//following::p[1]');}
  get OAS_ALLOWED_ORIGINS_SAVED() {return $('//span[text()="Allowed Origins"]//following::p[1]');}
  get OAS_ALLOWED_HEADERS_SAVED() {return $('//span[text()="Allowed Headers"]//following::p[1]');}
  get OAS_EXPOSED_HEADERS_SAVED() {return $('//span[text()="Exposed Headers"]//following::p[1]');}

  //OAS CACHE FIELDS
  get OAS_ENABLE_CACHE_TOGGLE() {return new Toggle_object('//label[text()="Enable Caching"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_UPSTREAM_CACHE_CONTROL_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.enableUpstreamCacheControl"]');}
  get OAS_CACHE_TIMEOUT_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.timeout"]');}
  get OAS_CACHE_RESPONSE_CODES_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheResponseCodes"]//div[@class="tyk-form-control"]');}
  get OAS_CACHE_ALL_SAVE_REQUEST_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.cacheAllSafeRequests"]');}
  get OAS_ADVANCED_OPTIONS_ACCORDION() {return $('//label[text()="Enable Caching"]//following::button[@class="tyk-accordion__trigger"][1]');}
  get OAS_CACHE_BY_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheByHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_CACHE_CONTROL_TTL_HEADER_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.controlTTLHeaderName"]');}
  get OAS_CACHE_TIMEOUT_SAVED() {return $('//span[text()="Cache Timeout"]//following::p[1]');}
  get OAS_CACHE_RESPONSE_CODES_SAVED() {return $('//span[text()="Cache Response Codes"]//following::p[1]');}
  get OAS_CACHE_BY_HEADERS_SAVED() {return $('//span[text()="Cache by Headers"]//following::p[1]')}
  get OAS_CACHE_CONTROL_TTL_HEADER_SAVED() {return $('//span[text()="Cache Control TTL Header"]//following::p[1]');}

  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() {return new Button_object('span*=Configure Api');}
  get SAVE_BUTTON() {return new Button_object('.//div[@class="tyk-fixed-wrapper "]//span[normalize-space() = "Save"]');}
  get OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS');}
  get DELETE_BUTTON() {return new Button_object('span=Delete');}

  //MODALS
  get MODAL() {return $('.tyk-modal__content');}
  get DELETE_API_BUTTON() {return this.MODAL.$('//button//span[text()="Delete API"]');}

<<<<<<< HEAD
  get API_NAME_INPUT() {return $('input[name="api_definition.name"]');}

  get api_created_expected_mesage() {return 'API successfuly created';}
  isApiCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.api_created_expected_mesage);}

=======
>>>>>>> master
  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }

}
export const apis_page = new Apis_page();