import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { URL, LANDING_PAGE_PATH } from './../../../../config_variables';
import { expect } from 'chai';
import { Dashboard_connection } from '../../../../lib/utils/api_connections/Dashboard_connection';
import { newPolicyDefinitionWithDefaults } from '../../../../lib/utils/Policy_object_designer';
var OasMapToPolicyTable_object = require('ui_test_automation/wrappers/OasMapToPolicyTable_object');

xdescribe('Test OIDC Authentication in OAS API designer page', () => {
  let envDetails;
  const dashboard_connection = new Dashboard_connection();

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Test OIDC default settings', () => {
    let firstApi = true;
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oidc-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("OpenID Connect");
    wdioExpect(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).not.toBeChecked();
    let oidcAuthUrl = $('a*=Learn more about OpenID Connect');
    wdioExpect(oidcAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/openid-connect/');
  });

  it('Test OIDC field validations', () => {
    apis_page.OAS_SAVE_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    let issuerTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::p[1]');
    let authKeyHeaderErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.header.name"]//following::p[1]');
    wdioExpect(issuerTargetUrlErrorMsg).toHaveText('Issuer target URL needs to have a valid URL value (eg. https://, http://)');
    wdioExpect(authKeyHeaderErrorMsg).toHaveText('Auth Key Header Name is required');
    apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.setValue('https://a.com');
    apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
    apis_page.OAS_SAVE_BUTTON.click();
    let mapClientToPolicyErrorMsg = $('//label[text()="Map Client to Policy"]//following::p[2]');
    wdioExpect(mapClientToPolicyErrorMsg).toHaveText("Clinet ID and Policy are required");
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.deleteMapping('');
    apis_page.OAS_OIDC_ADD_NEW_ISSUER_BUTTON.click();
    apis_page.OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT.setValue('https://a.com');
    browser.pause(1000);
    let issuerOneTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::p[1]');
    let issuerTwoTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::p[1]');
    wdioExpect(issuerOneTargetUrlErrorMsg).toHaveText('Issuer URLs need to be unique');
    wdioExpect(issuerTwoTargetUrlErrorMsg).toHaveText('Issuer URLs need to be unique');
  });

  it('User can save OIDC API', () => {
    let firstApi = true;
    openInitPage(firstApi);
    apis_page.API_NAME_INPUT.setValue('oidc-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
    apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("OpenID Connect");
    apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.waitForClickable();
    apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.setValue('https://issuer-target.com');
    apis_page.OAS_OIDC_AUTH_HEADER_INPUT.setValue('Authorization');    
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true;
  });

  it('OIDC data is displayed after page reload', () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    let mapClientToPolicySaved = $('//label[text()="Map Client to Policy"]//following::p[1]');
    let authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    wdioExpect(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('OpenID Connect');
    wdioExpect(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    wdioExpect(issuerTargetURLSaved).toHaveText('https://issuer-target.com');
    wdioExpect(mapClientToPolicySaved).toHaveText('No Client IDs mapped to Policies');
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization');
  });

  it('Prepare policies to test mappings', () => {
    apis_page.SIDE_MENU_BASE_LINK.click();
    let apiId = $('//label[text()="API ID"]//following::span[1]');
    apiId.waitForExist();
    let api_id = apiId.getAttribute('copy');
    ['policyA', 'policyB', 'policyC'].forEach(policyName => {
      let policyDetails = {
        "access_rights": {
          [api_id]: {
            "api_id": api_id,
            "api_name": "oidc-test",
            "versions": ["Default"]
          } 
        },
        "name": policyName
      };
      let policy = newPolicyDefinitionWithDefaults(policyDetails);
      dashboard_connection.createPolicy(policy, envDetails.userSecret);
    });
    browser.refresh();
  });

  it('User can map Clients to Policies', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.waitForExist();
    apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.setValue('http://new-issuer.com');
    apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.addNewMapping('http://client-a.com', 'policyA');
    apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.addNewMapping('http://client-b.com', 'policyB');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Clients to policies mapping is displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).toBeChecked();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    wdioExpect(issuerTargetURLSaved).toHaveText('http://new-issuer.com');
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-a.com')).to.equal('policyA');
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyB');
  });

  it('User can modify Clients to Policies mappings and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.changeName('http://client-a.com', 'https://client-c.com');
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.changePolicy('http://client-b.com', 'policyC');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Clients to policies mapping is displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('https://client-c.com')).to.equal('policyA');
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  it('User can remove Client mapping and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.deleteMapping('https://client-c.com');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Clients to policies mapping is displayed after page reload', () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    expect(clientToPolicyMappingSaved.checkIfRowExists('https://client-c.com')).to.be.false;
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  it('User can set Scope Claims and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX.click();
    apis_page.OAS_OIDC_SCOPE_NAME_INPUT.setValue('my-scope');
    apis_page.OAS_OIDC_ADD_CLAIM_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.addNewMapping('claimA', 'policyA');
    apis_page.OAS_OIDC_ADD_CLAIM_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.addNewMapping('claimB', 'policyB');
    apis_page.OAS_OIDC_AUTH_HEADER_INPUT.setValue('Authorization-new');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_OIDC_QUERY_PARAM_INPUT.setValue('query-param');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Scope Claims are displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    let authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    wdioExpect(scopeNameSaved).toHaveText('my-scope');
    expect(claimToPolicyMappingSaved.getPolicyValueForCell('claimA')).to.equal('policyA');
    expect(claimToPolicyMappingSaved.getPolicyValueForCell('claimB')).to.equal('policyB');
    wdioExpect(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).toBeChecked();
    wdioExpect(authKeyHeaderNameSaved).toHaveText('Authorization-new');
    wdioExpect(queryParamNameSaved).toHaveText('query-param');
  });

  it('User can modify Scope Claims and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_SCOPE_NAME_INPUT.setValue('my-scope-new');
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.changeName('claimA', 'claimD');
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.changePolicy('claimB', 'policyC');
    apis_page.OAS_OIDC_QUERY_PARAM_INPUT.setValue('query-param-new');
    apis_page.OAS_OIDC_USE_COOKIE_BOX.click();
    apis_page.OAS_OIDC_COOKIE_VALUE_INPUT.setValue('my-cookie');
    apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Scope Claims are displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    wdioExpect(scopeNameSaved).toHaveText('my-scope-new');
    expect(claimToPolicyMappingSaved.getPolicyValueForCell('claimD')).to.equal('policyA');
    expect(claimToPolicyMappingSaved.getPolicyValueForCell('claimB')).to.equal('policyC');
    wdioExpect(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    wdioExpect(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toBeChecked();
    wdioExpect(queryParamNameSaved).toHaveText('query-param-new');
    wdioExpect(cookieNameSaved).toHaveText('my-cookie');
  });

  it('User can remove Scope Claim and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.deleteMapping('claimB');
    apis_page.OAS_OIDC_USE_COOKIE_BOX.click();
    apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Updated Scope Claims are displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    expect(claimToPolicyMappingSaved.checkIfRowExists('claimB')).to.be.false;
    expect(claimToPolicyMappingSaved.getPolicyValueForCell('claimD')).to.equal('policyA');
    wdioExpect(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).not.toBeChecked();
    wdioExpect(apis_page.OAS_OIDC_USE_COOKIE_BOX).not.toBeChecked();
  });

  xit('User can disable Scope Claims and Save API', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  xit('Scope Claims is not displayed after page reload', () => {
    browser.refresh();
    wdioExpect(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).not.toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    wdioExpect(scopeNameSaved).not.toBeExisting();
  });

  it('User can add more issuers', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ADD_NEW_ISSUER_BUTTON.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT.setValue('http://second-issuer.com');
    apis_page.OAS_OIDC_ADD_CLIENT_TWO_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_TWO_TABLE.addNewMapping('http://second-client.com', 'policyA');
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Clients to policies mapping is displayed after page reload', () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
    let clientToPolicyMappingOneSaved = new OasMapToPolicyTable_object('//h3[text()="Issuer one"]//following::ul[1]');
    let clientToPolicyMappingTwoSaved = new OasMapToPolicyTable_object('//h3[text()="Issuer two"]//following::ul[1]');
    let issuerOneTargetURLSaved = $('//h3[text()="Issuer one"]//following::span[text()="Issuer Target URL"]//following::div[2]');
    let issuerTwoTargetURLSaved = $('//h3[text()="Issuer two"]//following::span[text()="Issuer Target URL"]//following::div[2]');
    wdioExpect(issuerOneTargetURLSaved).toHaveText('http://second-issuer.com');
    wdioExpect(issuerTwoTargetURLSaved).toHaveText('http://new-issuer.com');
    expect(clientToPolicyMappingOneSaved.getPolicyValueForCell('http://second-client.com')).to.equal('policyA');
    expect(clientToPolicyMappingTwoSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  it('User can remove issuer', () => {
    apis_page.EDIT_BUTTON.click();
    apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
    let deleteIssuerButton = $('//h3[text()="Issuer two"]//following::span[text()="Delete Issuer"]');
    deleteIssuerButton.click();
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true;
  });

  it('Clients to policies mapping is displayed after page reload', () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    wdioExpect(issuerTargetURLSaved).toHaveText('http://second-issuer.com');
    expect(clientToPolicyMappingSaved.getPolicyValueForCell('http://second-client.com')).to.equal('policyA');
  });

  function openInitPage(firstApi) {
    browser.navigateTo(URL + LANDING_PAGE_PATH);//TO BE REMOVED WHEN RELEASED
    firstApi ? apis_page.DESIGN_API_BOX.click() : apis_page.OAS_ADD_API_BUTTON.click();
  }

});