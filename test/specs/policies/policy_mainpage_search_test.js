import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';
import { newPolicyDefinitionWithDefaults } from '../../../lib/utils/Policy_object_designer';

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

const jwtApi2 = {
  "name": "secondjsonwebtoken",
  "use_keyless": false,
  "enable_jwt": true,
  "jwt_signing_method": "hmac",
  "jwt_identity_base_field": "sub"
};

describe('Test Policy search functionality on Main Policy Page', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API and Policy definitions via dashboard API', () => {
    [keylessApi, authTokenApi, oauthApi, multi1Api, multi2Api, jwtApi, jwtApi2].forEach(authType => {
      let apiBody = newAPIdefinitionWithDefaults(authType);
      let apiMeta = dashboard_connection.createAPI(apiBody, envDetails.userSecret);
      let apiId = dashboard_connection.getAPI(apiMeta, envDetails.userSecret).api_id;
      let policyDetails = {
        "access_rights": {
          [apiId]: {
            "api_id": apiId,
            "api_name": authType.name,
            "versions": ["Default"]
          } 
        },
        "name": authType.name + "_policy"
      }
      let policy = newPolicyDefinitionWithDefaults(policyDetails);
      dashboard_connection.createPolicy(policy, envDetails.userSecret);
  })
});

  it('User should be able search policy by Policy name', () => {
    main_page.openPolicies();
    policies_page.NAME_SEARCH_INPUT.setValue(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi2.name);
  });

  it('User should be able search policy by Policy id', () => {
    let policyId = dashboard_connection.getPolicyByName(oauthApi.name + "_policy", envDetails.userSecret).Data[0]._id;
    policies_page.NAME_SEARCH_INPUT.setValue(policyId);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi2.name);
  });

  it('User should be able search policy by Access Right', () => {
    policies_page.NAME_SEARCH_INPUT.setValue("");
    policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi2.name);
  });

  it('User should be able search policy by Authentication type', () => {
    policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption("All apis");
    policies_page.AUTH_TYPES_DROPDOWN.selectOption("JSON Web Token");
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    //wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(multi2Api.name); https://tyktech.atlassian.net/browse/TT-2019
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(jwtApi2.name);
  });
  
  it('User should be able search policy by multiple criteria - Name + Auth type', () => {
    policies_page.NAME_SEARCH_INPUT.setValue(jwtApi2.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(jwtApi2.name);
  });

  it('User should be able search policy by multiple criteria - Name + Access Right', () => {
    policies_page.AUTH_TYPES_DROPDOWN.selectOption("All authentication methods");
    policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(authTokenApi.name);
    policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(multi2Api.name);
    policies_page.NAME_SEARCH_INPUT.setValue(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi2.name);
  });

  it('User should be able search policy by multiple criteria - Auth Type + Access Right', () => {
    policies_page.NAME_SEARCH_INPUT.setValue("");
    policies_page.AUTH_TYPES_DROPDOWN.selectOption("Auth Token");
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(keylessApi.name);
    wdioExpect(policies_page.POLICY_TABLE).toHaveTextContaining(authTokenApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(oauthApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi1Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(multi2Api.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi.name);
    wdioExpect(policies_page.POLICY_TABLE).not.toHaveTextContaining(jwtApi2.name);
  });

});