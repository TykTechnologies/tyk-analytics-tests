import { Dashboard_admin_connection } from './api_connections/Dashboard_admin_connection';
import { v4 as uuid } from 'uuid';
import { generateRandomEmail } from './utils';
import { assert } from 'lib/utils/fixtures';
import { config } from '@variables';
import { APIRequestContext, request } from '@playwright/test';

export const setUpEnv = async () => {
    if (!config.CLEAN_TEST) { //returning default values from config
        console.debug(`>>> $CLEAN_TEST set to false -> tests will re-use already created org and user`);
        return { 
            userEmail: config.USER_EMAIL, 
            userPassword: config.USER_PASSWORD, 
            userSecret: config.USER_SECRET
        };
    }
    
    const dashboard_admin_request = new Dashboard_admin_connection();
    const authorizationHeader = {"admin-auth": config.ADMIN_SECRET};
    const orgCname = config.ORG_NAME + uuid();
    const adminEmail = generateRandomEmail();
    const adminPassword = config.USER_PASSWORD;

    //CHECKING IF ENV IS UP - TODO: move it to before all tests (to execute only once)
    const statusResponse = await dashboard_admin_request.getStatus(authorizationHeader);
    assert(statusResponse.ok()).toBeTruthy();
    const context: APIRequestContext = await request.newContext({});
    const gwStatusResponse: any = await context.get(config.GW_HELLO_API);
    assert(gwStatusResponse.ok()).toBeTruthy();
    const body = await gwStatusResponse.json();
    assert(body.details.dashboard.status).toEqual("pass");
    //PREPARING ORG
    console.debug(`>>> Preparing new ${orgCname} organization`);
    const testOrgBody = {"cname": orgCname,"cname_enabled": true,"owner_name": "test-org1","owner_slug": "default"};
    const orgID = await dashboard_admin_request.createOrg(testOrgBody, authorizationHeader);
    //PREPARING ADMIN USER
    const adminUserBody = {
        "active": true,
        "email_address": adminEmail,
        "first_name": "auto",
        "last_name": "admin",
        "org_id": orgID,
        "user_permissions": { "IsAdmin": "admin" }
    };
    // const context: APIRequestContext = await request.newContext({});
    const adminUserResponse = await context.post(config.DASHBOARD_ADMIN_API + config.USERS_API_PATH, {data: adminUserBody, headers: authorizationHeader});
    const reposneJson = await adminUserResponse.json();
    console.debug(`>>> Creating user response: ${reposneJson}`);
    const adminUserSecret = reposneJson.Message;
    const adminUserID = reposneJson.Meta.id;
    //UPDATE PASSWORD FOR USER
    const adminUserPasswordBody = {
        "active": true,
        "email_address": adminEmail,
        "first_name": "auto",
        "last_name": "admin",
        "org_id": orgID,
        "password": adminPassword,
        "user_permissions": { "IsAdmin": "admin" }
    };
    const updatePath = `${config.USERS_API_PATH}${adminUserID}`;
    const updatePasswordResponse = await context.put(config.DASHBOARD_ADMIN_API + updatePath, {data: adminUserPasswordBody, headers: authorizationHeader});
    assert(updatePasswordResponse.ok()).toBeTruthy();
    console.log(`>>> User was created: ${adminEmail}, secret: ${adminUserSecret}, organization: ${orgCname}`);
    return { userEmail: adminEmail, userPassword: adminPassword, userSecret: adminUserSecret};
};
