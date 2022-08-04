import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';

xdescribe('Test CORS settings on OAS API designer page', () => {
  let envDetails;
  let enableCors = true;
  let firstApi = false;
  let originValue = 'https://*.domain.com';
  let headerValue = 'my-custom-header';

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('CORS default state is disabled', () => {
    let enableCors = false;
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    expect(apis_page.OAS_ENABLE_CORS_TOGGLE.isSelected()).to.be.false;
    wdioExpect(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeDisplayed();
  });

  it('User can enable CORS and see default CORS values', () => {
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    wdioExpect(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_DEBUG_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_MAX_AGE_INPUT).toHaveValue("24");
    wdioExpect(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).toHaveText("GET\nHEAD\nPOST");
    wdioExpect(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).toHaveText("Allow all Origins");
    wdioExpect(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).toHaveText("Accept\nContent-Type\nOrigin\nX-Requested-With\nAuthorization");
    wdioExpect(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).toHaveText("");
  });

  it('User can save API with default CORS values', () => {
    let firstApi = true;
    openOasDesignerPage(firstApi, enableCors);
    let apiName = "defaults defaults everywhere";
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should not see CORS settings if Enable Options Pass Through is checked', () => {  
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_OPTIONS_PASS_THROUGH_BOX.click();
    corsOptionPassThruHidesOtherElements();
  });

  it('User can save API with enabled Enable Options Pass Through', () => {
    let apiName = "option-pass-through";
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Options Pass Through is persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeChecked();
    corsOptionPassThruHidesOtherElements();
  });

  it('User can change Allowed Methods and save API', () => {
    let apiName = 'allowed-methods';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOWED_METHODS_DROPDOWN.selectOptions(["HEAD", "POST", "PATCH", "DELETE"]);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Allowed Methods are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_ALLOWED_METHODS_SAVED).toHaveText("GET, PATCH, DELETE");
  });

  it('User can change Allow Credentials, Debug, Max Age and save API', () => {
    let apiName = 'Hey you out there on your own';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOW_CREDENTIALS_BOX.click();
    apis_page.OAS_DEBUG_BOX.click();
    apis_page.OAS_MAX_AGE_INPUT.setValue("34");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Data are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_ALLOW_CREDENTIALS_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_DEBUG_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_MAX_AGE_SAVED).toHaveText("34");
  });

  it('User can enter Allowed Origins and save API', () => {
    let apiName = 'allowed-origins';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOW_ALL_ORIGINS_BOX.click();
    apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN.setValue(originValue);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Allowed Origins are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_ALLOWED_ORIGINS_SAVED).toHaveText(originValue);
  });

  it('User can slect Allowed Headers or enter his own value and save API', () => {
    let apiName = 'allowed-headers';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.selectOptions(["Accept", "Origin"]);
    apis_page.OAS_ALLOWED_HEADERS_DROPDOWN.setValue(headerValue);
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Allowed Headers are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_ALLOWED_HEADERS_SAVED).toHaveText("Content-Type, X-Requested-With, Authorization, " + headerValue);
  });

  it('User can input Exposed Headers and save API', () => {
    let apiName = 'exposed-headers';
    openOasDesignerPage(firstApi, enableCors);
    apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.setValue("value-1-header");
    apis_page.OAS_EXPOSED_HEADERS_DROPDOWN.setValue("value-2");
    createApi(apiName);
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('Exposed Headers are persistent after reloading the page', () => {
    browser.refresh();
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
    wdioExpect(apis_page.OAS_EXPOSED_HEADERS_SAVED).toHaveText("value-1-header, value-2");
  });

  function openOasDesignerPage(firstApi, enableCors) {
    main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('cors-test');
    apis_page.OAS_NEXT_BUTTON.click();
    enableCors ? apis_page.OAS_ENABLE_CORS_TOGGLE.click() : null;
    apis_page.SIDE_MENU_MIDDLEWARE_LINK.click();
  }

  function createApi(apiName) {
    apis_page.SIDE_MENU_BASE_LINK.click();
    apis_page.API_NAME_INPUT.waitForClickable();
    apis_page.API_NAME_INPUT.setValue(apiName);
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.OAS_TARGET_URL_INPUT.setValue("http://httpbin.org");
    apis_page.OAS_SAVE_BUTTON.click();
  }

  function corsOptionPassThruHidesOtherElements() {
    wdioExpect(apis_page.OAS_OPTIONS_PASS_THROUGH_BOX).toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOW_CREDENTIALS_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_DEBUG_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOW_ALL_ORIGINS_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOW_ALL_HEADERS_BOX).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_MAX_AGE_INPUT).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOWED_METHODS_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOWED_ORIGINS_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_ALLOWED_HEADERS_DROPDOWN).not.toBeDisplayed();
    wdioExpect(apis_page.OAS_EXPOSED_HEADERS_DROPDOWN).not.toBeDisplayed();
  }

});
