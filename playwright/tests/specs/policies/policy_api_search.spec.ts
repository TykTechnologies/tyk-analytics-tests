import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

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

test('Test API search functionality on Add Policy Page', async ({ createUserAndLogin, main_page, policies_page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definitions via dashboard API', async () => {
    for (const authType of [keylessApi, authTokenApi, oauthApi, multi1Api, multi2Api, jwtApi]) {
      const body = newAPIdefinitionWithDefaults(authType);
      await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
    }
  });

  await test.step('User should be able search API by name', async () => {
    await main_page.openPolicies();
    await policies_page.ADD_POLICY_BUTTON.click();
    await policies_page.API_NAME_INPUT.fill(keylessApi.name);
    await assert(policies_page.API_TABLE).toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(jwtApi.name);
  });

  await test.step('User should be able to change API name in search criteria', async () => {
    await policies_page.API_NAME_INPUT.fill(authTokenApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(jwtApi.name);
  });

  await test.step('User should be able to clear API name in search criteria', async () => {
    await policies_page.API_NAME_INPUT.clear();
    await assert(policies_page.API_TABLE).toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).toContainText(jwtApi.name);
  });

  await test.step('User should be able to search by single Authentication type ', async () => {
    await policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("JSON Web Token");
    await assert(policies_page.API_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).toContainText(jwtApi.name);
  });

  await test.step('User should be able to clear Authentication type in search criteria', async () => {
    await policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("All authentication types");
    await assert(policies_page.API_TABLE).toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).toContainText(jwtApi.name);
  });

  await test.step('User should be able to search by multiple Authentication types ', async () => {
    await policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("Mutual TLS");
    await policies_page.AUTHENTICATION_TYPE_DROPDOWN.selectOption("OAuth 2.0");
    await assert(policies_page.API_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(jwtApi.name);
  });

  await test.step('User should be able to search by Api name plus Authentication type ', async () => {
    await policies_page.API_NAME_INPUT.fill(oauthApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(keylessApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(authTokenApi.name);
    await assert(policies_page.API_TABLE).toContainText(oauthApi.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi1Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(multi2Api.name);
    await assert(policies_page.API_TABLE).not.toContainText(jwtApi.name);
  });

});