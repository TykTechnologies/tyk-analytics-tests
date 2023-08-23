import { login_page } from '../../../../lib/pom/Login_page';
import { apis_page } from '../../../../lib/pom/Apis_page';
import { main_page } from '../../../../lib/pom/Main_page';
import { expect } from 'chai';
import { Dashboard_connection } from '../../../../lib/utils/api_connections/Dashboard_connection';
import { newPolicyDefinitionWithDefaults } from '../../../../lib/utils/Policy_object_designer';
var OasMapToPolicyTable_object = require('@wrappers/OasMapToPolicyTable_object');

test('Test OIDC Authentication in OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  let envDetails;
  const dashboard_connection = new Dashboard_connection();

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Test OIDC default settings', async () => {
    let firstApi = true;
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oidc-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("OpenID Connect");
    await assert(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    await assert(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).not.toBeChecked();
    let oidcAuthUrl = $('a*=Learn more about OpenID Connect');
    await assert(oidcAuthUrl).toHaveLink('https://tyk.io/docs/basic-config-and-security/security/authentication-authorization/openid-connect/');
  });

  await test.step('Test OIDC field validations', async () => {
   await apis_page.OAS_SAVE_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    let issuerTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::p[1]');
    await assert(issuerTargetUrlErrorMsg).toHaveText('Issuer target URL needs to have a valid URL value (eg. https://, http://)');
   await apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.fill('https://a.com');
   await apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    let mapClientToPolicyErrorMsg = $('//label[text()="Map Client to Policy"]//following::p[2]');
    await assert(mapClientToPolicyErrorMsg).toHaveText("Clinet ID and Policy are required");
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.deleteMapping('');
   await apis_page.OAS_OIDC_ADD_NEW_ISSUER_BUTTON.click();
   await apis_page.OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT.fill('https://a.com');
    browser.pause(1000);
    let issuerOneTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::p[1]');
    let issuerTwoTargetUrlErrorMsg = $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::p[1]');
    await assert(issuerOneTargetUrlErrorMsg).toHaveText('Issuer URLs need to be unique');
    await assert(issuerTwoTargetUrlErrorMsg).toHaveText('Issuer URLs need to be unique');
  });

  await test.step('User can save OIDC API', async () => {
    let firstApi = true;
    openInitPage(firstApi);
   await apis_page.API_NAME_INPUT.fill('oidc-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_ENABLE_AUTH_TOGGLE.click();
   await apis_page.OAS_AUTHENTICATION_DROPDOWN.selectOption("OpenID Connect");
    apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.waitForClickable();
   await apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.fill('https://issuer-target.com');
   await apis_page.OAS_OIDC_USE_HEADER_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('OIDC data is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    let mapClientToPolicySaved = $('//label[text()="Map Client to Policy"]//following::p[1]');
    let authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    await assert(apis_page.OAS_AUTHENTICATION_SAVED).toHaveText('OpenID Connect');
    await assert(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    await assert(issuerTargetURLSaved).toHaveText('https://issuer-target.com');
    await assert(mapClientToPolicySaved).toHaveText('No Client IDs mapped to Policies');
    await assert(authKeyHeaderNameSaved).toHaveText('Authorization');
  });

  await test.step('Prepare policies to test mappings', async () => {
   await apis_page.SIDE_MENU_BASE_LINK.click();
    let apiId = $('//label[text()="API ID"]//following::span[1]');
    apiId.waitFor();
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

  await test.step('User can map Clients to Policies', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.waitFor();
   await apis_page.OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT.fill('http://new-issuer.com');
   await apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.addNewMapping('http://client-a.com', 'policyA');
   await apis_page.OAS_OIDC_ADD_CLIENT_ONE_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.addNewMapping('http://client-b.com', 'policyB');
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Clients to policies mapping is displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).toBeChecked();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    await assert(issuerTargetURLSaved).toHaveText('http://new-issuer.com');
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-a.com')).to.equal('policyA');
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyB');
  });

  await test.step('User can modify Clients to Policies mappings and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.changeName('http://client-a.com', 'https://client-c.com');
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.changePolicy('http://client-b.com', 'policyC');
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Clients to policies mapping is displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX).not.toBeChecked();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('https://client-c.com')).to.equal('policyA');
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  await test.step('User can remove Client mapping and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE.deleteMapping('https://client-c.com');
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Clients to policies mapping is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    assert(clientToPolicyMappingSaved.checkIfRowExists('https://client-c.com')).to.be.false;
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  await test.step('User can set Scope Claims and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX.click();
   await apis_page.OAS_OIDC_SCOPE_NAME_INPUT.fill('my-scope');
   await apis_page.OAS_OIDC_ADD_CLAIM_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.addNewMapping('claimA', 'policyA');
   await apis_page.OAS_OIDC_ADD_CLAIM_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.addNewMapping('claimB', 'policyB');
   await apis_page.OAS_OIDC_AUTH_HEADER_INPUT.fill('Authorization-new');
   await apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
   await apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_OIDC_QUERY_PARAM_INPUT.fill('query-param');
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Scope Claims are displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    let authKeyHeaderNameSaved = $('//label[text()="Auth Key Header Name"]//following::div[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    await assert(scopeNameSaved).toHaveText('my-scope');
    assert(claimToPolicyMappingSaved.getPolicyValueForCell('claimA')).to.equal('policyA');
    assert(claimToPolicyMappingSaved.getPolicyValueForCell('claimB')).to.equal('policyB');
    await assert(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    await assert(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).toBeChecked();
    await assert(authKeyHeaderNameSaved).toHaveText('Authorization-new');
    await assert(queryParamNameSaved).toHaveText('query-param');
  });

  await test.step('User can modify Scope Claims and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_SCOPE_NAME_INPUT.fill('my-scope-new');
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.changeName('claimA', 'claimD');
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.changePolicy('claimB', 'policyC');
   await apis_page.OAS_OIDC_QUERY_PARAM_INPUT.fill('query-param-new');
   await apis_page.OAS_OIDC_USE_COOKIE_BOX.click();
   await apis_page.OAS_OIDC_COOKIE_VALUE_INPUT.fill('my-cookie');
   await apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Scope Claims are displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    let queryParamNameSaved = $('//label[text()="Query parameter Name"]//following::div[1]');
    let cookieNameSaved = $('//label[text()="Cookie Name"]//following::div[1]');
    await assert(scopeNameSaved).toHaveText('my-scope-new');
    assert(claimToPolicyMappingSaved.getPolicyValueForCell('claimD')).to.equal('policyA');
    assert(claimToPolicyMappingSaved.getPolicyValueForCell('claimB')).to.equal('policyC');
    await assert(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).toBeChecked();
    await assert(apis_page.OAS_STRIP_AUTHORIZATION_DATA_BOX).not.toBeChecked();
    await assert(queryParamNameSaved).toHaveText('query-param-new');
    await assert(cookieNameSaved).toHaveText('my-cookie');
  });

  await test.step('User can remove Scope Claim and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE.deleteMapping('claimB');
   await apis_page.OAS_OIDC_USE_COOKIE_BOX.click();
   await apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Updated Scope Claims are displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).toBeChecked();
    let claimToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Claim to Policy"]//following::ul[1]');
    assert(claimToPolicyMappingSaved.checkIfRowExists('claimB')).to.be.false;
    assert(claimToPolicyMappingSaved.getPolicyValueForCell('claimD')).to.equal('policyA');
    await assert(apis_page.OAS_OIDC_ALLOW_QUERY_PARAM_BOX).not.toBeChecked();
    await assert(apis_page.OAS_OIDC_USE_COOKIE_BOX).not.toBeChecked();
  });

  xawait test.step('User can disable Scope Claims and Save API', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  xawait test.step('Scope Claims is not displayed after page reload', async () => {
    browser.refresh();
    await assert(apis_page.OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX).not.toBeChecked();
    let scopeNameSaved = $('//span[text()="Scope Name"]//following::div[2]');
    await assert(scopeNameSaved).not.toBeExisting();
  });

  await test.step('User can add more issuers', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
   await apis_page.OAS_OIDC_ADD_NEW_ISSUER_BUTTON.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
   await apis_page.OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT.fill('http://second-issuer.com');
   await apis_page.OAS_OIDC_ADD_CLIENT_TWO_BUTTON.click();
    apis_page.OAS_OIDC_MAP_CLIENT_TO_POLICY_TWO_TABLE.addNewMapping('http://second-client.com', 'policyA');
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Clients to policies mapping is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
    let clientToPolicyMappingOneSaved = new OasMapToPolicyTable_object('//h3[text()="Issuer one"]//following::ul[1]');
    let clientToPolicyMappingTwoSaved = new OasMapToPolicyTable_object('//h3[text()="Issuer two"]//following::ul[1]');
    let issuerOneTargetURLSaved = $('//h3[text()="Issuer one"]//following::span[text()="Issuer Target URL"]//following::div[2]');
    let issuerTwoTargetURLSaved = $('//h3[text()="Issuer two"]//following::span[text()="Issuer Target URL"]//following::div[2]');
    await assert(issuerOneTargetURLSaved).toHaveText('http://second-issuer.com');
    await assert(issuerTwoTargetURLSaved).toHaveText('http://new-issuer.com');
    assert(clientToPolicyMappingOneSaved.getPolicyValueForCell('http://second-client.com')).to.equal('policyA');
    assert(clientToPolicyMappingTwoSaved.getPolicyValueForCell('http://client-b.com')).to.equal('policyC');
  });

  await test.step('User can remove issuer', async () => {
   await apis_page.EDIT_BUTTON.click();
   await apis_page.SIDE_MENU_SERVER_LINK.click();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    apis_page.OAS_OIDC_ISSUER_TWO_ACCORDTION.expand();
    let deleteIssuerButton = $('//h3[text()="Issuer two"]//following::span[text()="Delete Issuer"]');
    deleteIssuerButton.click();
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Clients to policies mapping is displayed after page reload', async () => {
    browser.refresh();
    apis_page.OAS_OIDC_ISSUER_ONE_ACCORDTION.expand();
    let clientToPolicyMappingSaved = new OasMapToPolicyTable_object('//label[text()="Map Client to Policy"]//following::ul[1]');
    let issuerTargetURLSaved = $('//span[text()="Issuer Target URL"]//following::div[2]');
    await assert(issuerTargetURLSaved).toHaveText('http://second-issuer.com');
    assert(clientToPolicyMappingSaved.getPolicyValueForCell('http://second-client.com')).to.equal('policyA');
  });

  function openInitPage(firstApi) {
    await main_page.openAPIs();
    firstApi ? apis_page.DESIGN_API_BOX.click() :await apis_page.ADD_NEW_API_BUTTON.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
  }

});