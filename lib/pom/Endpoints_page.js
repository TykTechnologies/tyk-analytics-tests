var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');

class Endpoints_page extends Page {
  
  get OAS_ENDPOINTS_BUTTON() {return new Button_object('a*=Endpoints');}
  get OAS_ADD_NEW_ENDPOINT_BUTTON() {return new Button_object('span*=Add New Endpoint');}
  get OAS_ENDPOINT_METHOD_DROPDOWN() {return $('//label[text()="Method"]//following::span[1]');}
  get OAS_ENDPOINT_PATH_INPUT() {return new Input_object('//input[@placeholder="Type path"]');}
  get OAS_ADD_ENDPOINT_BUTTON() {return new Button_object('span*=Add Endpoint');}
  get OAS_ENDPOINT_WHITELIST_BUTTON() {return new Button_object('span*=Add Whitelist');}
  get OAS_OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS');}
  get OAS_EDIT_ENDPOINT_BUTTON() {return new Button_object('span*=Edit Endpoint');}
  get OAS_REMOVE_ENDPOINT_BUTTON() {return new Button_object('//ul[@class="tyk-dropdown-menu tyk-dropdown opened"]//following::span[text()="Remove Endpoint"]');}
  get OAS_SEARCH_ENDPOINTS_INPUT() {return new Input_object('//input[@placeholder="Search Endpoints"]');}
  get OAS_FILTER_METHOD_DROPDOWN() {return new DropDown_object('//span[contains(text(), "Show")]//following::span[1]');}
  get OAS_REMOVE_CONFIRMATION_BUTTON() {return new Button_object('//button/span[text()="Remove Endpoint"]');}
  get OAS_UPDATE_ENDPOINT_BUTTON() {return new Button_object('span*=Update Endpoint');}
  get OAS_NO_ENDPOINTS_MESSAGE() {return $('//h2[text()="No endpoints yet."]');}
  get OAS_ADD_MIDDLEWARE_BUTTON_TOP() {return new Button_object('(//button/span[text()="Add Middleware"])[1]');}
  get OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM() {return new Button_object('(//button/span[text()="Add Middleware"])[2]');}
  get OAS_UPDATE_MIDDLEWARE_BUTTON() {return new Button_object('span*=Update Middleware');}
  get OAS_ENDPOINTS_MIDDLEWARE_TEXT() {return $('h2*=Middleware');}

  addMiddlewareByName(middleware) {
    let middlewareSelector = new Button_object(`p*=${middleware}`);
    this.OAS_ADD_MIDDLEWARE_BUTTON_TOP.click();
    middlewareSelector.click();
    this.OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM.click();
  }

  removeMiddlewareByName(middleware) {
    let middlewareSelector = $(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/following-sibling::button`);
    let optionsButtonSelector = $('(//span[text()="OPTIONS"])[2]');
    let removeMiddlewareSelector = $('(//span[text()="Remove Middleware"])[2]');
    middlewareSelector.click();
    optionsButtonSelector.waitForClickable();
    optionsButtonSelector.click();
    removeMiddlewareSelector.waitForClickable();
    removeMiddlewareSelector.click();
    let removeMiddlewareConfirmationSelector = $('//button[contains(@class, "tyk-button--danger")]//span[text()="Remove Middleware"]');
    removeMiddlewareConfirmationSelector.click();
  }

  changeMiddlewareStatusByName(middleware) {
    let middlewareSelector = $(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/following-sibling::button`);
    let enableToggleSelector = $('//div[@class="middleware-modal__enable-cmd"]//span[@class="tyk-toggle__item-notch tyk-toggle__item-notch--single"]');
    middlewareSelector.click();
    enableToggleSelector.waitForClickable();
    enableToggleSelector.click();
    this.OAS_UPDATE_MIDDLEWARE_BUTTON.click();
  }

  verifyMiddlewareDisabledByName(middleware) {
    let middlewareSelector = $(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/preceding-sibling::p[text()="Disabled"]`);
    return middlewareSelector.isDisplayed();
  }

  verifyMiddlewareExistsByName(middleware) {
    let middlewareSelector = $(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]`);
    this.OAS_ENDPOINTS_MIDDLEWARE_TEXT.waitForDisplayed();
    return middlewareSelector.isDisplayed();
  }

  clickOnEndpoint(endpoint, method) {
    let endpointUrlLink = encodeURIComponent(endpoint.split('/').join('-')) + method.toLowerCase();
    let endpointmiddlewareSelector = new Button_object(`//a[contains(@href, "${endpointUrlLink}")]`);
    endpointmiddlewareSelector.click();
  }

  addNewEndpoint(endpoint, method) {
    let methodmiddlewareSelector = $(`//li[@title="${method}"]`);
    this.OAS_ADD_NEW_ENDPOINT_BUTTON.waitForClickable();
    this.OAS_ADD_NEW_ENDPOINT_BUTTON.click();
    this.OAS_ENDPOINT_METHOD_DROPDOWN.waitForClickable();
    this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
    this.OAS_ENDPOINT_PATH_INPUT.setValue(endpoint);
    this.OAS_ADD_ENDPOINT_BUTTON.click();
  }

  removeEndpoint(endpoint, method) {
    this.clickOnEndpoint(endpoint, method);
    this.OAS_OPTIONS_BUTTON.click();
    this.OAS_REMOVE_ENDPOINT_BUTTON.waitForClickable();
    this.OAS_REMOVE_ENDPOINT_BUTTON.click();
    this.OAS_REMOVE_CONFIRMATION_BUTTON.click();
  }

  modifyEndpoint(endpoint, method, newEndpoint, newMethod) {
    this.clickOnEndpoint(endpoint, method);
    this.OAS_OPTIONS_BUTTON.click();
    this.OAS_EDIT_ENDPOINT_BUTTON.click();
    let methodmiddlewareSelector = $(`//li[@title="${newMethod}"]`);
    this.OAS_ENDPOINT_METHOD_DROPDOWN.waitForClickable();
    this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
    this.OAS_ENDPOINT_PATH_INPUT.setValue(newEndpoint);
    this.OAS_UPDATE_ENDPOINT_BUTTON.click();
  }

  searchEndpointsByName(endpoint) {
    this.OAS_SEARCH_ENDPOINTS_INPUT.setValue(endpoint);
  }

  clearSerachCriteria() {
    this.OAS_SEARCH_ENDPOINTS_INPUT.clear();
  }

  filterEndpointsByMethod(method) {
    let methodmiddlewareSelector = $(`//li[@title="${method}"]`);
    this.OAS_FILTER_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
  }

  clearMethodsFilter() {
    let methodmiddlewareSelector = $(`//li[@title="All methods"]`);
    this.OAS_FILTER_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
  }

}
export const endpoints_page = new Endpoints_page();