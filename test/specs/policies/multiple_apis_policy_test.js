import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { policies_page } from '../../../lib/pom/Policies_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const policyDetails = {
  policyName: 'multiple_apis',
  keyEpiryTime: "1 hour",
};

const basicAuthApisDetails = [
    {
        "name": "basic_auth_1",
        "use_basic_auth": true,
        "use_keyless": false
    },
    {
        "name": "basic_auth_2",
        "use_basic_auth": true,
        "use_keyless": false
    },
    {
        "name": "basic_auth_3",
        "use_basic_auth": true,
        "use_keyless": false
    },
];

const authTokenApiDetails = [
    {
        "name": "open_1",
        "use_keyless": false,

    }
];

describe('Multiple APIs policies', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API definitions via dashboard API', () => {
    const allApis = [...authTokenApiDetails,...basicAuthApisDetails];
    console.log(`>> Creating ${allApis.length} API definitions`);
    allApis.forEach (api => {
        let apiDefinition = newAPIdefinitionWithDefaults(api);
        dashboard_connection.createAPI(apiDefinition, envDetails.userSecret);
    });    
  });

  it('User should be able to create new Policy with multiple APIs', () => {
    main_page.openPolicies();
    policies_page.ADD_POLICY_BUTTON.click();
    policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[0].name);
    policies_page.API_TABLE.waitForDisplayed({reverse: true}); //waiting for table to be hidden
    policies_page.API_SECTION_HEADER.click(); //opening section with API table
    policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[1].name);
    policies_page.CONFIGURATIONS_TAB_BUTTON.click();
    policies_page.NAME_INPUT.setValue(policyDetails.policyName);
    policies_page.KEY_EXPIRY_AFTER_DROPDOWN.selectOption(policyDetails.keyEpiryTime);
    policies_page.CREATE_POLICY_BUTTON.click();
  });

  it(`User can't add policy with different Authorization type to policy`, () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    policies_page.API_SECTION_HEADER.click(); //opening section with API table
    const isOpenAPnotAvailable = policies_page.API_TABLE.isCellWithTextNotDisplayed(authTokenApiDetails[0].name);
    expect(isOpenAPnotAvailable).to.be.true;
  });

  it('User should be able to add API with tha same Authorization type to policy', () => {
    policies_page.API_TABLE.clickCellWithText(basicAuthApisDetails[2].name);
    policies_page.UPDATE_POLICY_BUTTON.click();
    policies_page.UPDATE_CONFIRMATION_BUTTON.click();
  });

  it('User should be able to see all APIs assigned to policy', () => {
    main_page.openPolicies();
    policies_page.POLICY_TABLE.clickCellWithText(policyDetails.policyName);
    wdioExpect($$('.policy-api__api-name')).toBeElementsArrayOfSize(3);
    basicAuthApisDetails.forEach(api => wdioExpect($(`span=${api.name}`)).toBeDisplayed());
  });

  it('User should be able to delete API access from policy', () => {
    $(`span=${basicAuthApisDetails[1].name}`).click();
    const $removeAPIButton = $(`span=${basicAuthApisDetails[1].name}`).$('../..').$(`span=Remove Access`);
    $removeAPIButton.click();
    policies_page.CONFIRM_BUTTON.click();
    wdioExpect($$('.policy-api__api-name')).toBeElementsArrayOfSize(2);
  });
});