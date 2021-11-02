import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { tib_page } from '../../../lib/pom/Tib_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
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

describe('TIB profile creation tests', () => {
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
    main_page.openIdentityManagement();
  });

  xit('User should be able to add SAML profile', () => {
    tib_page.CREATE_PROFILE_BUTTON.click();
    tib_page.PROFILE_NAME_INPUT.setValue(samlProfile.name);
    tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(samlProfile.type);
    tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.SAML_CERTIFICATE_DROPDOWN.selectFirstOption();
    tib_page.SAML_URL_INPUT.setValue(samlProfile.url);
    tib_page.CREATE_PROFILE_BUTTON.click();
    expect(tib_page.isProfileCreatedPopUpDisplayed()).to.be.true;
  });

  xit('User should be able to open SAML profile', () => {
    verifyProfileCanBeOpened(samlProfile.name);
  });
    
  it('User should be able to add LDAP profile', () => {
    tib_page.CREATE_PROFILE_BUTTON.click();
    tib_page.PROFILE_NAME_INPUT.setValue(ldapProfile.name);
    tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(ldapProfile.type);
    tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.LDAP_SERVER_INPUT.setValue(ldapProfile.server);
    tib_page.LDAP_PORT_INPUT.setValue(ldapProfile.port);
    tib_page.LDAP_USERDN_INPUT.setValue(ldapProfile.dn);
    tib_page.CREATE_PROFILE_BUTTON.click();
    expect(tib_page.isProfileCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to open LDAP profile', () => {
    verifyProfileCanBeOpened(ldapProfile.name);
  });

  it('User should be able to add OpenID profile', () => {
    tib_page.CREATE_PROFILE_BUTTON.click();
    tib_page.PROFILE_NAME_INPUT.setValue(oidcProfile.name);
    tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(oidcProfile.type);
    tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.OICD_CLIENT_ID_INPUT.setValue(oidcProfile.clientId);
    tib_page.OICD_CLIENT_SECRET_INPUT.setValue(oidcProfile.clientSecret);
    tib_page.OICD_DISCOVER_URL_INPUT.setValue(oidcProfile.url);
    tib_page.CREATE_PROFILE_BUTTON.click();
    expect(tib_page.isProfileCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to open OpenID profile', () => {
    verifyProfileCanBeOpened(oidcProfile.name);
  });

  it('User should be able to add Social profile', () => {
    tib_page.CREATE_PROFILE_BUTTON.click();
    tib_page.PROFILE_NAME_INPUT.setValue(socialProfile.name);
    tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(socialProfile.type);
    tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.SOCIAL_POLICY_DROPDOWN.click();
    tib_page.selectFirstPolicyFromDropdown();
    tib_page.SOCIAL_PROVIDER_DROPDOWN.selectFirstOption();
    tib_page.SOCIAL_CLIENT_ID_INPUT.setValue(socialProfile.clientId);
    tib_page.SOCIAL_CLIENT_SECRET_INPUT.setValue(socialProfile.clientSecret);
    tib_page.CREATE_PROFILE_BUTTON.click();
    expect(tib_page.isProfileCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to open Social profile', () => {
    verifyProfileCanBeOpened(socialProfile.name);
  });

  function verifyProfileCanBeOpened(profileName){
    $profileTableElement = $(`td=${profileName}`);
    $profileNameHeader = $(`h1*=${profileName}`);
    $profileTableElement.click();
    wdioExpect($profileNameHeader).toBeDisplayed();
  }

});