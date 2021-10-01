import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { keys_page } from '../../../lib/pom/Keys_page.js';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';


/*const policyDetails = {
  apiName: 'test_policy',
  policyName: 'policy_auto_test_1',
  policyNameUpdate: 'policy_auto_test_1_update',
  keyEpiryTime: "1 hour",
  keyEpiryTimeUpdateValue: "6 hours"
};*/

describe('Create/update/delete keys', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  /*it('Prerequisits: creating API definition via dashboard API', () => {
    const apiDefinition = newAPIdefinitionWithDefaults({"name":policyDetails.apiName});
    dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
  });*/

  it('User should be able to create new Key', () => {
    main_page.openKeys();
    keys_page.ADD_KEY_BUTTON.click();

  });








});