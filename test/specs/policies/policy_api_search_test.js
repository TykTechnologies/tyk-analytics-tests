import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const keylessApi = {
  "name": "keyless"
};

const authTokenApi = {
  "name": "authtoken",
  "use_keyless": false,
  "use_standard_auth": true
};

const oauthApi = {
  "name": "oauth",
  "use_keyless": false,
  "oauth_meta": {
    "allowed_access_types": [
      "client_credentials"
    ],
    "allowed_authorize_types": [
      "token"
    ],
    "auth_login_redirect": ""
  },
  "use_oauth2": true
};

const multi1Api = {
  "name": "multi1",
  "use_keyless": false,
  "base_identity_provided_by": "auth_token",
  "use_standard_auth": true,
  "use_mutual_tls_auth": true
};

const multi2Api = {
  "name": "multi2",
  "use_keyless": false,
  "base_identity_provided_by": "jwt_claim",
  "enable_jwt": true,
  "use_basic_auth": true,
  "jwt_signing_method": "hmac",
  "jwt_identity_base_field": "sub",

};

const jwtApi = {
  "name": "jwt",
  "use_keyless": false,
  "enable_jwt": true,
  "jwt_signing_method": "hmac",
  "jwt_identity_base_field": "sub"
};

const policyDetails = {
  authTokenPolicyName: 'api_search_test_policy',
  keyEpiryTime: "1 hour",
};

describe('Test API search functionality on Add Policy Page', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API definitions via dashboard API', () => {
    [keylessApi, authTokenApi, oauthApi, multi1Api, multi2Api, jwtApi].forEach(authType => {
      let body = newAPIdefinitionWithDefaults(authType);
      dashboard_connection.createAPI(body, envDetails.userSecret);
    })
  });

  it('User should be able search API by name', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_NAME_INPUT.setValue(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to change API name in search criteria', () => {
    policies_page.API_NAME_INPUT.setValue(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to clear API name in search criteria', () => {
    policies_page.API_NAME_INPUT.clearValue();
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to search by single Authentication type ', () => {
    policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("JSON Web Token");
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to clear Authentication type in search criteria', () => {
    policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("All authentication types");
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to search by multiple Authentication types ', () => {
    policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("Mutual TLS");
    policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("OAuth 2.0");
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(jwtApi.name);
  });

  it('User should be able to search by Api name plus Authentication type ', () => {
    policies_page.API_NAME_INPUT.setValue(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.API_TABLE).toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.API_TABLE).not.toHaveTextContaining(jwtApi.name);
  });
  
});