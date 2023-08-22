import { test, assert } from '@fixtures';

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


xtest('Create/update/delete keys by ID without policy', async ({ createUserAndLogin, main_page }) => {
  const dashboard_connection = new Dashboard_connection();
  let envDetails;
  let keyIdValue;
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
      const body = newAPIdefinitionWithDefaults(BasicAuthApi);
      dashboard_connection.createAPI(body, envDetails.userSecret);
  });

  await test.step('User should be able to create new Key', async () => {
    main_page.openKeys();
   await keys_page.ADD_KEY_BUTTON.click();
   await keys_page.CHOOSE_API_TOGGLE.click();
    wdioExpect(keys_page.CHOOSE_API_TABLE).toHaveTextContaining(BasicAuthApi.name);
   await keys_page.CHOOSE_API_TABLE.clickCellWithText(BasicAuthApi.name);
   await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
   await keys_page.ALIAS_INPUT_FIELD.click();
   await keys_page.ALIAS_INPUT_FIELD.fill(apiKeysDetails.alias);
   await keys_page.KEY_EXPIRE_DROPDOWN.click();
   await keys_page.KEY_EXPIRE_DROPDOWN.selectOption(apiKeysDetails.keyExpiryTime);
   await keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
   await keys_page.AUTHENTICATION_BUTTON.click();
   await keys_page.AUTH_USERNAME.click();
   await keys_page.AUTH_USERNAME.fill(apiKeysDetails.username);
   await keys_page.AUTH_PASSWORD.click();
   await keys_page.AUTH_PASSWORD.fill(apiKeysDetails.password);
   await keys_page.CREATE_KEY_BUTTON.click();
   await keys_page.OK_BUTTON.click();
    expect(keys_page.isKeyCreatedPopUpDisplayed()).to.be.true;
  });

  it('User should be able to modify key',()=>{
    keyIdValue= keys_page.KEY_ID_BUTTON.getAttribute('copy');
    main_page.openKeys();
   await keys_page.KEY_SEARCH_FIELD.click();
   await keys_page.KEY_SEARCH_FIELD.fill(keyIdValue);
   await keys_page.LOOKUP_KEY_BUTTON.click();
   await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    wdioExpect(keys_page.KEY_ID_VALUE).toHaveAttributeContaining('copy', keyIdValue);
    wdioExpect(keys_page.UPDATE_BUTTON).toBeClickable();
    wdioExpect(keys_page.UPDATE_WITHOUT_QUOTA_RESET_BUTTON).toBeClickable();
    wdioExpect(keys_page.DELETE_BUTTON).toBeClickable();
    wdioExpect(keys_page.ALIAS_INPUT_FIELD).toHaveValue(apiKeysDetails.alias);
   await keys_page.ALIAS_INPUT_FIELD.click();
   await keys_page.ALIAS_INPUT_FIELD.fill(updatedKeyDetails.aliasUpdate);
   await keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
   await keys_page.KEY_EXPIRE_DROPDOWN.click();
   await keys_page.METADATA_KEY_INPUT.fill(updatedKeyDetails.metadataKey);
   await keys_page.METADATA_VALUE_INPUT.fill(updatedKeyDetails.metadataValue);
   await keys_page.METADATA_ADD_BUTTON.click();
   await keys_page.AUTHENTICATION_BUTTON.click();
   await keys_page.CREATE_NEW_PASSWORD_CHECKBOX.click();
   await keys_page.AUTH_PASSWORD.fill(updatedKeyDetails.newPassword);
   await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
   await keys_page.KEY_EXPIRE_DROPDOWN.selectOption(updatedKeyDetails.keyExpiryTimeUpdateValue);
   await keys_page.UPDATE_BUTTON.click();
   await keys_page.CONFIRM_BUTTON.click();
    wdioExpect(keys_page.ALIAS_INPUT_FIELD).toHaveValue(updatedKeyDetails.aliasUpdate);
  });

  await test.step('Confirmation popup should be displayed', async () => {
    expect(keys_page.isKeyUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User must be able to Delete Key',()=>{
 await keys_page.DELETE_BUTTON.click();
 await keys_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
  expect(keys_page.isKeyDeletedPopUpDisplayed()).to.be.true;
  browser.pause(1000);
 await keys_page.KEY_SEARCH_FIELD.click();
 await keys_page.KEY_SEARCH_FIELD.fill(keyIdValue);
 await keys_page.LOOKUP_KEY_BUTTON.click();
  expect(keys_page.isCouldNotRetrieveKeyDisplayed()).to.be.true;
  });




  });