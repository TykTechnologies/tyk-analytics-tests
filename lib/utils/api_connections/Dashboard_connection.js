var { API_connection } = require('./API_connection');
const config_variables = require('../../../config_variables');

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
    }

    prepareConfig(config) {
        if (config.headers === undefined) {config.headers = {};}
        config.headers.Authorization = config_variables.USER_SECRET;
        return config;
    }
}
