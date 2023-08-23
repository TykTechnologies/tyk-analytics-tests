import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Input_object } from '@wrappers/Input_object';
import { DropDown_object } from '@wrappers/DropDown_object';

export class Endpoints_page extends Template_Page {
  
  get OAS_ENDPOINTS_BUTTON() {return new Button_object('a*=Endpoints', this.page);}
  get OAS_ADD_NEW_ENDPOINT_BUTTON() {return new Button_object('span*=Add New Endpoint', this.page);}
  get OAS_ENDPOINT_METHOD_DROPDOWN() {this.page.locator('//label[text()="Method"]//following::span[1]');}
  get OAS_ENDPOINT_PATH_INPUT() {return new Input_object('//input[@placeholder="Type path"]', this.page);}
  get OAS_ADD_ENDPOINT_BUTTON() {return new Button_object('span*=Add Endpoint', this.page);}
  get OAS_ENDPOINT_WHITELIST_BUTTON() {return new Button_object('span*=Add Whitelist', this.page);}
  get OAS_OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS', this.page);}
  get OAS_EDIT_ENDPOINT_BUTTON() {return new Button_object('span*=Edit Endpoint', this.page);}
  get OAS_REMOVE_ENDPOINT_BUTTON() {return new Button_object('//ul[@class="tyk-dropdown-menu tyk-dropdown opened"]//following::span[text()="Remove Endpoint"]', this.page);}
  get OAS_SEARCH_ENDPOINTS_INPUT() {return new Input_object('//input[@placeholder="Search Endpoints"]', this.page);}
  get OAS_FILTER_METHOD_DROPDOWN() {return new DropDown_object('//span[contains(text(), "Show")]//following::span[1]', this.page);}
  get OAS_REMOVE_CONFIRMATION_BUTTON() {return new Button_object('//button/span[text()="Remove Endpoint"]', this.page);}
  get OAS_UPDATE_ENDPOINT_BUTTON() {return new Button_object('span*=Update Endpoint', this.page);}
  get OAS_NO_ENDPOINTS_MESSAGE() {this.page.locator('//h2[text()="No endpoints yet."]');}
  get OAS_ADD_MIDDLEWARE_BUTTON_TOP() {return new Button_object('(//button/span[text()="Add Middleware"])[1]', this.page);}
  get OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM() {return new Button_object('(//button/span[text()="Add Middleware"])[2]', this.page);}
  get OAS_UPDATE_MIDDLEWARE_BUTTON() {return new Button_object('span*=Update Middleware', this.page);}
  get OAS_ENDPOINTS_MIDDLEWARE_TEXT() {this.page.locator('h2*=Middleware');}

  addMiddlewareByName(middleware) {
    let middlewareSelector = new Button_object(`p*=${middleware}`);
    await this.OAS_ADD_MIDDLEWARE_BUTTON_TOP.click();
    middlewareSelector.click();
    await this.OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM.click();
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
    await this.OAS_UPDATE_MIDDLEWARE_BUTTON.click();
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
    await this.OAS_ADD_NEW_ENDPOINT_BUTTON.click();
    this.OAS_ENDPOINT_METHOD_DROPDOWN.waitForClickable();
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
    await this.OAS_ENDPOINT_PATH_INPUT.fill(endpoint);
    await this.OAS_ADD_ENDPOINT_BUTTON.click();
  }

  removeEndpoint(endpoint, method) {
    this.clickOnEndpoint(endpoint, method);
    await this.OAS_OPTIONS_BUTTON.click();
    this.OAS_REMOVE_ENDPOINT_BUTTON.waitForClickable();
    await this.OAS_REMOVE_ENDPOINT_BUTTON.click();
    await this.OAS_REMOVE_CONFIRMATION_BUTTON.click();
  }

  modifyEndpoint(endpoint, method, newEndpoint, newMethod) {
    this.clickOnEndpoint(endpoint, method);
    await this.OAS_OPTIONS_BUTTON.click();
    await this.OAS_EDIT_ENDPOINT_BUTTON.click();
    let methodmiddlewareSelector = $(`//li[@title="${newMethod}"]`);
    this.OAS_ENDPOINT_METHOD_DROPDOWN.waitForClickable();
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
    await this.OAS_ENDPOINT_PATH_INPUT.fill(newEndpoint);
    await this.OAS_UPDATE_ENDPOINT_BUTTON.click();
  }

  searchEndpointsByName(endpoint) {
    await this.OAS_SEARCH_ENDPOINTS_INPUT.fill(endpoint);
  }

  clearSerachCriteria() {
    this.OAS_SEARCH_ENDPOINTS_INPUT.clear();
  }

  filterEndpointsByMethod(method) {
    let methodmiddlewareSelector = $(`//li[@title="${method}"]`);
    await this.OAS_FILTER_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
  }

  clearMethodsFilter() {
    let methodmiddlewareSelector = $(`//li[@title="All methods"]`);
    await this.OAS_FILTER_METHOD_DROPDOWN.click();
    methodmiddlewareSelector.click();
  }

}