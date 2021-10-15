import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { keys_page } from '../../../lib/pom/Keys_page.js';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '../../../lib/utils/API_object_designer';

const BasicAuthApi = {
    "name": "basic_auth",
    "use_basic_auth": true,
    "use_keyless": false,
};

const apiKeysDetails = {
  apiName: 'basic_auth',
  keyExpiryTime: "1 hour",
  alias:'test',
  username: 'qa@test.com',
  password: 'test123'
};

const updatedKeyDetails={
  keyExpiryTimeUpdateValue: "12 hours",
  aliasUpdate:'updateAlias',
  metadataKey:'test',
  metadataValue:'123',
  newPassword:'111111',
};


describe('Create/update/delete keys by ID without policy', () => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Prerequisits: creating API definition via dashboard API', () => {
      const body = newAPIdefinitionWithDefaults(BasicAuthApi);
      dashboard_connection.createAPI(body, envDetails.userSecret);
  });

  it('User should be able to create new Key', () => {
    main_page.openKeys();
    keys_page.ADD_KEY_BUTTON.click();
    keys_page.CHOOSE_API_TOGGLE.click();
    wdioExpect(keys_page.CHOOSE_API_TABLE).toHaveTextContaining(BasicAuthApi.name);
    keys_page.CHOOSE_API_TABLE.clickCellWithText(BasicAuthApi.name);
    keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    keys_page.ALIAS_INPUT_FIELD.click();
    keys_page.ALIAS_INPUT_FIELD.setValue(apiKeysDetails.alias);
    keys_page.KEY_EXPIRE_DROPDOWN.click();
    keys_page.KEY_EXPIRE_DROPDOWN.selectOption(apiKeysDetails.keyExpiryTime);
    keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
    keys_page.AUTHENTICATION_BUTTON.click();
    keys_page.AUTH_USERNAME.click();
    keys_page.AUTH_USERNAME.setValue(apiKeysDetails.username);
    keys_page.AUTH_PASSWORD.click();
    keys_page.AUTH_PASSWORD.setValue(apiKeysDetails.password);
    keys_page.CREATE_KEY_BUTTON.click();
    keys_page.OK_BUTTON.click();
    expect(keys_page.isKeyCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to modify key',()=>{
    const keyIdValue= keys_page.KEY_ID_BUTTON.getAttribute('copy');
    main_page.openKeys();
    keys_page.KEY_SEARCH_FIELD.click();
    keys_page.KEY_SEARCH_FIELD.setValue(keyIdValue);
    keys_page.LOOKUP_KEY_BUTTON.click();
    keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(keys_page.KEY_ID_VALUE).toHaveAttributeContaining('copy', keyIdValue);
    wdioExpect(keys_page.UPDATE_BUTTON).toBeClickable();
    wdioExpect(keys_page.UPDATE_WITHOUT_QUOTA_RESET_BUTTON).toBeClickable();
    wdioExpect(keys_page.DELETE_BUTTON).toBeClickable();
    wdioExpect(keys_page.ALIAS_INPUT_FIELD).toHaveValue(apiKeysDetails.alias);
    keys_page.ALIAS_INPUT_FIELD.click();
    keys_page.ALIAS_INPUT_FIELD.setValue(updatedKeyDetails.aliasUpdate);
    keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
    keys_page.KEY_EXPIRE_DROPDOWN.click();
    keys_page.KEY_EXPIRE_DROPDOWN.selectOption(updatedKeyDetails.keyExpiryTimeUpdateValue);
    keys_page.METADATA_KEY_INPUT.setValue(updatedKeyDetails.metadataKey);
    keys_page.METADATA_VALUE_INPUT.setValue(updatedKeyDetails.metadataValue);
    keys_page.METADATA_ADD_BUTTON.click();
    keys_page.AUTHENTICATION_BUTTON.click();
    keys_page.CREATE_NEW_PASSWORD_CHECKBOX.click();
    keys_page.AUTH_PASSWORD.setValue(updatedKeyDetails.newPassword);
    keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    keys_page.UPDATE_BUTTON.click();
    keys_page.CONFIRM_BUTTON.click();
    wdioExpect(keys_page.ALIAS_INPUT_FIELD).toHaveValue(updatedKeyDetails.aliasUpdate);
    wdioExpect(keys_page.KEY_EXPIRE_DROPDOWN).toHaveText(updatedKeyDetails.keyExpiryTimeUpdateValue);
  });

  it('Confirmation popup should be displayed', () => {
    expect(keys_page.isKeyUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User must be able to Delete Key',()=>{
  const DeletedKeyIDValue= keys_page.KEY_ID_VALUE.getAttribute('copy');
  keys_page.DELETE_BUTTON.click();
  keys_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
  expect(keys_page.isKeyDeletedPopUpDisplayed()).to.be.true;
  browser.pause(1000);
  keys_page.KEY_SEARCH_FIELD.click();
  keys_page.KEY_SEARCH_FIELD.setValue(DeletedKeyIDValue);
  keys_page.LOOKUP_KEY_BUTTON.click();
  expect(keys_page.isCouldNotRetrieveKeyDisplayed()).to.be.true;
  });




  });