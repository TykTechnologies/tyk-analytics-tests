import { test, assert } from '@fixtures';

import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';
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

test('Test Policy search functionality on Main Policy Page', async ({ createUserAndLogin, main_page }) => {
  const dashboard_connection = new Dashboard_connection();
  

  
  await test.step('Prerequisits: creating API and Policy definitions via dashboard API', async () => {
    [keylessApi, authTokenApi, oauthApi, multi1Api, multi2Api, jwtApi, jwtApi2].forEach(authType => {
      let apiBody = newAPIdefinitionWithDefaults(authType);
      let apiMeta = await dashboard_connection.createAPI(apiBody, createUserAndLogin.userSecret);
      let apiId = dashboard_connection.getAPI(apiMeta, createUserAndLogin.userSecret).api_id;
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
      dashboard_connection.createPolicy(policy, createUserAndLogin.userSecret);
  })
});

  await test.step('User should be able search policy by Policy name', async () => {
    await main_page.openPolicies();
   await policies_page.NAME_SEARCH_INPUT.fill(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi2.name);
  });

  await test.step('User should be able search policy by Policy id', async () => {
    let policyId = dashboard_connection.getPolicyByName(oauthApi.name + "_policy", createUserAndLogin.userSecret).Data[0]._id;
   await policies_page.NAME_SEARCH_INPUT.fill(policyId);
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi2.name);
  });

  await test.step('User should be able search policy by Access Right', async () => {
   await policies_page.NAME_SEARCH_INPUT.fill("");
   await policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi2.name);
  });

  await test.step('User should be able search policy by Authentication type', async () => {
   await policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption("All apis");
   await policies_page.AUTH_TYPES_DROPDOWN.selectOption("JSON Web Token");
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    //await assert(policies_page.POLICY_TABLE).toContainText(multi2Api.name); https://tyktech.atlassian.net/browse/TT-2019
    await assert(policies_page.POLICY_TABLE).toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(jwtApi2.name);
  });
  
  await test.step('User should be able search policy by multiple criteria - Name + Auth type', async () => {
   await policies_page.NAME_SEARCH_INPUT.fill(jwtApi2.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(jwtApi2.name);
  });

  await test.step('User should be able search policy by multiple criteria - Name + Access Right', async () => {
   await policies_page.AUTH_TYPES_DROPDOWN.selectOption("All authentication methods");
   await policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(authTokenApi.name);
   await policies_page.ACCESS_RIGHTS_DROPDOWN.selectOption(multi2Api.name);
   await policies_page.NAME_SEARCH_INPUT.fill(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi2.name);
  });

  await test.step('User should be able search policy by multiple criteria - Auth Type + Access Right', async () => {
   await policies_page.NAME_SEARCH_INPUT.fill("");
   await policies_page.AUTH_TYPES_DROPDOWN.selectOption("Auth Token");
    await assert(policies_page.POLICY_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.POLICY_TABLE).toContainText(authTokenApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi.name);
    await assert(policies_page.POLICY_TABLE).not.toContainText(jwtApi2.name);
  });

});