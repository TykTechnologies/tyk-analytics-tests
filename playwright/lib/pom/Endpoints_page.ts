import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Input_object } from '@wrappers/Input_object';
import { DropDown_object } from '@wrappers/DropDown_object';

export class Endpoints_page extends Template_Page {

  get OAS_ENDPOINTS_BUTTON() { return new Button_object('a*=Endpoints', this.page); }
  get OAS_ADD_NEW_ENDPOINT_BUTTON() { return new Button_object('span*=Add New Endpoint', this.page); }
  get OAS_ENDPOINT_METHOD_DROPDOWN() { return this.page.locator('//label[text()="Method"]//following::span[1]'); }
  get OAS_ENDPOINT_PATH_INPUT() { return new Input_object('//input[@placeholder="Type path"]', this.page); }
  get OAS_ADD_ENDPOINT_BUTTON() { return new Button_object('span*=Add Endpoint', this.page); }
  get OAS_ENDPOINT_WHITELIST_BUTTON() { return new Button_object('span*=Add Whitelist', this.page); }
  get OAS_OPTIONS_BUTTON() { return new Button_object('span*=OPTIONS', this.page); }
  get OAS_EDIT_ENDPOINT_BUTTON() { return new Button_object('span*=Edit Endpoint', this.page); }
  get OAS_REMOVE_ENDPOINT_BUTTON() { return new Button_object('//ul[@class="tyk-dropdown-menu tyk-dropdown opened"]//following::span[text()="Remove Endpoint"]', this.page); }
  get OAS_SEARCH_ENDPOINTS_INPUT() { return new Input_object('//input[@placeholder="Search Endpoints"]', this.page); }
  get OAS_FILTER_METHOD_DROPDOWN() { return new DropDown_object('//span[contains(text(), "Show")]//following::span[1]', this.page); }
  get OAS_REMOVE_CONFIRMATION_BUTTON() { return new Button_object('//button/span[text()="Remove Endpoint"]', this.page); }
  get OAS_UPDATE_ENDPOINT_BUTTON() { return new Button_object('span*=Update Endpoint', this.page); }
  get OAS_NO_ENDPOINTS_MESSAGE() { return this.page.locator('//h2[text()="No endpoints yet."]'); }
  get OAS_ADD_MIDDLEWARE_BUTTON_TOP() { return new Button_object('(//button/span[text()="Add Middleware"])[1]', this.page); }
  get OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM() { return new Button_object('(//button/span[text()="Add Middleware"])[2]', this.page); }
  get OAS_UPDATE_MIDDLEWARE_BUTTON() { return new Button_object('span*=Update Middleware', this.page); }
  get OAS_ENDPOINTS_MIDDLEWARE_TEXT() { return this.page.locator('h2*=Middleware'); }

  async addMiddlewareByName(middleware: any) {
    const middlewareSelector = new Button_object(this.page.locator('p').filter({ hasText: `${middleware}` }), this.page);
    await this.OAS_ADD_MIDDLEWARE_BUTTON_TOP.click();
    await middlewareSelector.click();
    await this.OAS_ADD_MIDDLEWARE_BUTTON_BOTTOM.click();
  }

  async removeMiddlewareByName(middleware: any) {
    const middlewareSelector = await this.page.locator(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/following-sibling::button`);
    const optionsButtonSelector = await this.page.locator('(//span[text()="OPTIONS"])[2]');
    const removeMiddlewareSelector = await this.page.locator('(//span[text()="Remove Middleware"])[2]');
    await middlewareSelector.click();
    await optionsButtonSelector.waitFor();
    await optionsButtonSelector.click();
    await removeMiddlewareSelector.waitFor();
    await removeMiddlewareSelector.click();
    const removeMiddlewareConfirmationSelector = await this.page.locator('//button[contains(@class, "tyk-button--danger")]//span[text()="Remove Middleware"]');
    await removeMiddlewareConfirmationSelector.click();
  }

  async changeMiddlewareStatusByName(middleware: any) {
    const middlewareSelector = await this.page.locator(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/following-sibling::button`);
    const enableToggleSelector = await this.page.locator('//div[@class="middleware-modal__enable-cmd"]//span[@class="tyk-toggle__item-notch tyk-toggle__item-notch--single"]');
    await middlewareSelector.click();
    await enableToggleSelector.waitFor();
    await enableToggleSelector.click();
    await this.OAS_UPDATE_MIDDLEWARE_BUTTON.click();
  }

  async verifyMiddlewareDisabledByName(middleware: any) {
    const middlewareSelector = await this.page.locator(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]/preceding-sibling::p[text()="Disabled"]`);
    return await middlewareSelector.isVisible();
  }

  async verifyMiddlewareExistsByName(middleware: any) {
    const middlewareSelector = await this.page.locator(`//li[@class="applied-middleware__list-item"]//p[text()="${middleware}"]`);
    await this.OAS_ENDPOINTS_MIDDLEWARE_TEXT.waitFor();
    return await middlewareSelector.isVisible();
  }

  async clickOnEndpoint(endpoint: string, method: string) {
    const endpointUrlLink = encodeURIComponent(endpoint.split('/').join('-')) + method.toLowerCase();
    const endpointmiddlewareSelector = new Button_object(`//a[contains(@href, "${endpointUrlLink}")]`, this.page);
    await endpointmiddlewareSelector.click();
  }

  async addNewEndpoint(endpoint: string, method: any) {
    const methodmiddlewareSelector = await this.page.locator(`//li[@title="${method}"]`);
    await this.OAS_ADD_NEW_ENDPOINT_BUTTON.waitFor();
    await this.OAS_ADD_NEW_ENDPOINT_BUTTON.click();
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.waitFor();
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    await methodmiddlewareSelector.click();
    await this.OAS_ENDPOINT_PATH_INPUT.fill(endpoint);
    await this.OAS_ADD_ENDPOINT_BUTTON.click();
  }

  async removeEndpoint(endpoint: any, method: any) {
    await this.clickOnEndpoint(endpoint, method);
    await this.OAS_OPTIONS_BUTTON.click();
    await this.OAS_REMOVE_ENDPOINT_BUTTON.waitFor();
    await this.OAS_REMOVE_ENDPOINT_BUTTON.click();
    await this.OAS_REMOVE_CONFIRMATION_BUTTON.click();
  }

  async modifyEndpoint(endpoint: any, method: any, newEndpoint: string, newMethod: any) {
    await this.clickOnEndpoint(endpoint, method);
    await this.OAS_OPTIONS_BUTTON.click();
    await this.OAS_EDIT_ENDPOINT_BUTTON.click();
    const methodmiddlewareSelector = await this.page.locator(`//li[@title="${newMethod}"]`);
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.waitFor();
    await this.OAS_ENDPOINT_METHOD_DROPDOWN.click();
    await methodmiddlewareSelector.click();
    await this.OAS_ENDPOINT_PATH_INPUT.fill(newEndpoint);
    await this.OAS_UPDATE_ENDPOINT_BUTTON.click();
  }

  async searchEndpointsByName(endpoint: string) {
    await this.OAS_SEARCH_ENDPOINTS_INPUT.fill(endpoint);
  }

  clearSerachCriteria() {
    this.OAS_SEARCH_ENDPOINTS_INPUT.clear();
  }

  async filterEndpointsByMethod(method: any) {
    const methodmiddlewareSelector = await this.page.locator(`//li[@title="${method}"]`);
    await this.OAS_FILTER_METHOD_DROPDOWN.click();
    await methodmiddlewareSelector.click();
  }

  async clearMethodsFilter() {
    const methodmiddlewareSelector = await this.page.locator(`//li[@title="All methods"]`);
    await this.OAS_FILTER_METHOD_DROPDOWN.click();
    await methodmiddlewareSelector.click();
  }

}