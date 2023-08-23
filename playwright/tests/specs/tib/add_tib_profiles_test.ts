import { test, assert } from '@fixtures';

import { tib_page } from '../../../lib/pom/Tib_page';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import { newPolicyDefinitionWithDefaults } from '../../../lib/utils/Policy_object_designer';
const path = require('path');

let envDetails;
const certFileLocation = './test/specs/tib/public_key.pem';

const samlProfile = {
  name: "samlProfile",
  type: "SAML",
  url: "https://cosiek.com"
};

const ldapProfile = {
  name: "ldapProfile",
  type: "LDAP",
  server: "https://cosiek.com",
  port: "883",
  dn: "cn=dash"
};

const oidcProfile = {
  name: "oicdProfile",
  type: "OpenID Connect",
  clientId: "id123",
  clientSecret: "secret123",
  url: "https://cosiek.com/.well-known/config"
};

const socialProfile = {
  name: "socialProfile",
  type: "Social",
  clientId: "id123",
  clientSecret: "secret123"
};

const keylessApi = {
  "name": "keyless"
};

test('TIB profile creation tests', async ({ createUserAndLogin, main_page }) => {
  const dashboard_connection = new Dashboard_connection();
  let $profileTableElement;
  let $profileNameHeader;

  before(() => {
    envDetails = setUpEnv();
    dashboard_connection.uploadCert(certFileLocation, envDetails.userSecret);
    let apiBody = newAPIdefinitionWithDefaults(keylessApi);
    let apiMeta = dashboard_connection.createAPI(apiBody, envDetails.userSecret);
    let apiId = dashboard_connection.getAPI(apiMeta, envDetails.userSecret).api_id;
    let policyDetails = {
      "access_rights": {
        [apiId]: {
          "api_id": apiId,
          "api_name": keylessApi.name,
          "versions": ["Default"]
        } 
      },
      "name": keylessApi.name + "_policy"
    };
    let policy = newPolicyDefinitionWithDefaults(policyDetails);
    dashboard_connection.createPolicy(policy, envDetails.userSecret);
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  beforeEach(() => {
    await main_page.openIdentityManagement();
  });

  xawait test.step('User should be able to add SAML profile', async () => {
   await tib_page.CREATE_PROFILE_BUTTON.click();
   await tib_page.PROFILE_NAME_INPUT.fill(samlProfile.name);
   await tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(samlProfile.type);
   await tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.SAML_CERTIFICATE_DROPDOWN.selectFirstOption();
   await tib_page.SAML_URL_INPUT.fill(samlProfile.url);
   await tib_page.CREATE_PROFILE_BUTTON.click();
    assert(tib_page.isProfileCreatedPopUpDisplayed()).toBeTruthy();
  });

  xawait test.step('User should be able to open SAML profile', async () => {
    verifyProfileCanBeOpened(samlProfile.name);
  });
    
  await test.step('User should be able to add LDAP profile', async () => {
   await tib_page.CREATE_PROFILE_BUTTON.click();
   await tib_page.PROFILE_NAME_INPUT.fill(ldapProfile.name);
   await tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(ldapProfile.type);
   await tib_page.PROVIDER_NEXT_BUTTON.click();
   await tib_page.LDAP_SERVER_INPUT.fill(ldapProfile.server);
   await tib_page.LDAP_PORT_INPUT.fill(ldapProfile.port);
   await tib_page.LDAP_USERDN_INPUT.fill(ldapProfile.dn);
   await tib_page.CREATE_PROFILE_BUTTON.click();
    assert(tib_page.isProfileCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to open LDAP profile', async () => {
    verifyProfileCanBeOpened(ldapProfile.name);
  });

  await test.step('User should be able to add OpenID profile', async () => {
   await tib_page.CREATE_PROFILE_BUTTON.click();
   await tib_page.PROFILE_NAME_INPUT.fill(oidcProfile.name);
   await tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(oidcProfile.type);
   await tib_page.PROVIDER_NEXT_BUTTON.click();
   await tib_page.OICD_CLIENT_ID_INPUT.fill(oidcProfile.clientId);
   await tib_page.OICD_CLIENT_SECRET_INPUT.fill(oidcProfile.clientSecret);
   await tib_page.OICD_DISCOVER_URL_INPUT.fill(oidcProfile.url);
   await tib_page.CREATE_PROFILE_BUTTON.click();
    assert(tib_page.isProfileCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to open OpenID profile', async () => {
    verifyProfileCanBeOpened(oidcProfile.name);
  });

  await test.step('User should be able to add Social profile', async () => {
   await tib_page.CREATE_PROFILE_BUTTON.click();
   await tib_page.PROFILE_NAME_INPUT.fill(socialProfile.name);
   await tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(socialProfile.type);
   await tib_page.PROVIDER_NEXT_BUTTON.click();
   await tib_page.SOCIAL_POLICY_DROPDOWN.click();
    tib_page.selectFirstPolicyFromDropdown();
    tib_page.SOCIAL_PROVIDER_DROPDOWN.selectFirstOption();
   await tib_page.SOCIAL_CLIENT_ID_INPUT.fill(socialProfile.clientId);
   await tib_page.SOCIAL_CLIENT_SECRET_INPUT.fill(socialProfile.clientSecret);
   await tib_page.CREATE_PROFILE_BUTTON.click();
    assert(tib_page.isProfileCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to open Social profile', async () => {
    verifyProfileCanBeOpened(socialProfile.name);
  });

  function verifyProfileCanBeOpened(profileName){
    $profileTableElement = $(`td=${profileName}`);
    $profileNameHeader = $(`h1*=${profileName}`);
    $profileTableElement.click();
    await assert($profileNameHeader).toBeDisplayed();
  }

});