var { API_connection } = require('./API_connection');
const config_variables = require('../../../config_variables');
const fs = require('fs');

export class Dashboard_connection extends API_connection {
    constructor(){
        super(config_variables.DASHBOARD_API);
    }
    
    getUserWithEmail(userEmail, secret) {
        console.debug(`>>> Getting user with email ${userEmail}`);
        const response = this.sendGetRequest({path: config_variables.USERS_API_PATH, Authorization: secret});
        const usersList = response.body.users;
        console.debug(usersList);
        return usersList.filter((user) => user.email_address === userEmail);
    }

    createAPI(apiDefinition, userSecret){
        console.log(`>>> Creating API with name: ${apiDefinition.api_definition.name}`);
        const config = {
            path: "apis/",
            body: apiDefinition,
            headers: {Authorization: userSecret}
        };
        const response = this.sendPostRequest(config);
        expect(response.status).to.equal(200, 'Failed to create API definition!');
        console.log(`>>> API created. API definition id: ${response.body.Meta}`);
        return response.body.Meta;
    }

    getAPI(meta, userSecret){
        console.log(`>>> Get API for meta: ${meta}`);
        const config = {
            path: "apis/" + meta,
            headers: {Authorization: userSecret}
        };
        const response = this.sendGetRequest(config);
        expect(response.status).to.equal(200, 'Failed to retrieve API details!');
        console.log(`>>> API received. API definition: ${response.body}`);
        return response.body.api_definition;
    }

    createPolicy(policyDefinition, userSecret){
        console.log(`>>> Creating Policy with name: ${policyDefinition.name}`);
        const config = {
            path: "portal/policies/",
            body: policyDefinition,
            headers: {Authorization: userSecret}
        };
        const response = this.sendPostRequest(config);
        expect(response.status).to.equal(200, 'Failed to create Policy definition!');
        console.log(`>>> Policy created. Policy definition id: ${response.Meta}`);
    }

    getPolicyByName(name, userSecret){
        console.log(`>>> Get Policy by name: ${name}`);
        const config = {
            path: "portal/policies/search/?q=" + name,
            headers: {Authorization: userSecret}
        };
        const response = this.sendGetRequest(config);
        expect(response.status).to.equal(200, 'Failed to retrieve Policy details!');
        console.log(`>>> Policy received. Policy definition: ${response.body}`);
        return response.body;
    }

    uploadCert(certFile, userSecret){
        console.log('>>> Uploading Certificate');
        const config = {
            path: "certs/",
            file: certFile,
            headers: { Authorization: userSecret }
        };
        const response = this.sendPostRequest(config);
        expect(response.status).to.equal(200, 'Failed to upload Certificate!');
        console.log(`>>> Certificate added. Cert id: ${response.id}`);
    }

    prepareConfig(config) {
        if (config.headers === undefined) {config.headers = {};}
        config.headers.Authorization = config_variables.USER_SECRET;
        return config;
    }
}
