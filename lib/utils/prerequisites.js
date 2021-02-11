import { Dashboard_admin_connection } from './api_connections/Dashboard_admin_connection';
import * as config_variables from '../../config_variables';
import { uuid } from 'uuidv4';
import { generateRandomEmail } from './utils';

export const setUpEnv = () => {
    if (!config_variables.CLEAN_TEST) { //returning default values from config
        log.debug(`>>> $CLEAN_TEST set to false -> tests will re-use already created org and user`);
        return { 
            userEmail: config_variables.USER_EMAIL, 
            userPassword: config_variables.USER_PASSWORD, 
            userSecret: config_variables.USER_SECRET
        };
    }
    
    const dashboard_admin_request = new Dashboard_admin_connection();
    const authorizationHeader = {"admin-auth": config_variables.ADMIN_SECRET};
    const orgCname = config_variables.ORG_NAME + uuid();
    const adminEmail = generateRandomEmail();
    const adminPassword = config_variables.USER_PASSWORD;

    //PREPARING ORG
    console.debug(`>>> Preparing new ${orgCname} organization`);
    const testOrgBody = {"cname": orgCname,"cname_enabled": true,"owner_name": "test-org1","owner_slug": "default"};
    const orgID = dashboard_admin_request.createOrg(testOrgBody, authorizationHeader);
    //PREPARING ADMIN USER
    const adminUserBody = {
        "active": true,
        "email_address": adminEmail,
        "first_name": "auto",
        "last_name": "admin",
        "org_id": orgID,
        "user_permissions": { "IsAdmin": "admin" }
    };
    const adminUserResponse = dashboard_admin_request
        .sendPostRequest({path: config_variables.USERS_API_PATH, body: adminUserBody, headers: authorizationHeader});
    const adminUserSecret = adminUserResponse.body.Message;
    const adminUserID = adminUserResponse.body.Meta.id;
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
    const updatePath = `${config_variables.USERS_API_PATH}${adminUserID}`;
    dashboard_admin_request.sendPutRequest({path: updatePath, body: adminUserPasswordBody, headers: authorizationHeader});

    console.log(`User was created: ${adminEmail}, secret: ${adminUserSecret}, organization: ${orgCname}`);
    return { userEmail: adminEmail, userPassword: adminPassword, userSecret: adminUserSecret};
};
