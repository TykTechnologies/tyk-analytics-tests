var { API_connection } = require('./API_connection');
const config_variables = require('../../../config_variables');

export class Dashboard_admin_connection extends API_connection {    
    constructor(){
        super(config_variables.DASHBOARD_ADMIN_API);
    }

    createOrg(body, headers) {
        const response = this.sendPostRequest({path: config_variables.ORG_API_PATH, body, headers});
        expect(response.status).to.equal(200, 'Organisation was not created!');
        console.debug(`New organization was created: ${response.body}`);
        return response.body.Meta; 
    }

    getStatus(headers) {
        console.log(">>> Checking is dashboard is up");
        const response = this.sendGetRequest({path: config_variables.HELLO_PATH, headers});
        return response;
    }

    // getOrgsWithName(orgName = config_variables.ORG_NAME) {
    //     const response = this.sendGetRequest({path: this.ORG_PREFIX});
    //     const orgList = response.body.organisations;
    //     console.debug(`>>> Number of created Organisations: ${orgList.length}`);
    //     return orgList.filter((org) => org.cname === orgName);
    // };

    // prepareConfig(config) {
    //     if (config.headers === undefined) {config.headers = {};}
    //     if (config.headers["admin-auth"] === undefined) {
    //         config.headers["admin-auth"] = config_variables.ADMIN_SECRET;
    //     };
    //     return config;
    // }
}
