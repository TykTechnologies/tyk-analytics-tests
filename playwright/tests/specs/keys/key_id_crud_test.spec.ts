import { test, assert } from '@fixtures';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection.js';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const BasicAuthApi = {
  "name": "basic_auth",
  "use_basic_auth": true,
  "use_keyless": false,
};

const apiKeysDetails = {
  apiName: 'basic_auth',
  keyExpiryTime: "1 hour",
  alias: 'test',
  username: 'qa@test.com',
  password: 'test123'
};

const updatedKeyDetails = {
  keyExpiryTimeUpdateValue: "12 hours",
  aliasUpdate: 'updateAlias',
  metadataKey: 'test',
  metadataValue: '123',
  newPassword: '111111',
};


test('Create/update/delete keys by ID without policy', async ({ createUserAndLogin, main_page, keys_page }) => {
  test.setTimeout(2000000);
  const dashboard_connection = new Dashboard_connection();

  let keyIdValue: string | null;

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const body = newAPIdefinitionWithDefaults(BasicAuthApi);
    await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
  });

  await test.step('User should be able to create new Key', async () => {
    await main_page.openKeys();
    await keys_page.ADD_KEY_BUTTON.click();
    await keys_page.CHOOSE_API_TOGGLE.click();
    await assert(keys_page.CHOOSE_API_TABLE).toContainText(BasicAuthApi.name);
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
    assert(keys_page.checkIfKeyCreatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to modify key', async () => {
    keyIdValue = await keys_page.COPY_KEY_ID_BUTTON.getAttribute('copy');
    await main_page.openKeys();
    await keys_page.KEY_SEARCH_FIELD.click();
    await keys_page.KEY_SEARCH_FIELD.fill(keyIdValue || '');
    await keys_page.LOOKUP_KEY_BUTTON.click();
    await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    await assert(keys_page.UPDATE_BUTTON).toBeVisible();
    await assert(keys_page.UPDATE_WITHOUT_QUOTA_RESET_BUTTON).toBeVisible();
    await assert(keys_page.DELETE_BUTTON).toBeVisible();
    await assert(keys_page.ALIAS_INPUT_FIELD).toHaveValue(apiKeysDetails.alias);
    await keys_page.ALIAS_INPUT_FIELD.click();
    await keys_page.ALIAS_INPUT_FIELD.fill(updatedKeyDetails.aliasUpdate || '');
    await keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
    await keys_page.KEY_EXPIRE_DROPDOWN.click();
    await keys_page.METADATA_KEY_INPUT.fill(updatedKeyDetails.metadataKey || '');
    await keys_page.METADATA_VALUE_INPUT.fill(updatedKeyDetails.metadataValue || '');
    await keys_page.METADATA_ADD_BUTTON.click();
    await keys_page.AUTHENTICATION_BUTTON.click();
    await keys_page.CREATE_NEW_PASSWORD_CHECKBOX.click();
    await keys_page.AUTH_PASSWORD.fill(updatedKeyDetails.newPassword || '');
    await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    await keys_page.KEY_EXPIRE_DROPDOWN.selectOption(updatedKeyDetails.keyExpiryTimeUpdateValue || '');
    await keys_page.UPDATE_BUTTON.click();
    await keys_page.CONFIRM_BUTTON.click();
    await assert(keys_page.ALIAS_INPUT_FIELD).toHaveValue(updatedKeyDetails.aliasUpdate || '');
  });

  await test.step('Confirmation popup should be displayed', async () => {
    await keys_page.checkIfKeyUpdatedPopUpDisplayed();
  });

  await test.step('User must be able to Delete Key', async () => {
    await keys_page.DELETE_BUTTON.click();
    await keys_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    await keys_page.KEY_SEARCH_FIELD.click();
    await keys_page.KEY_SEARCH_FIELD.fill(keyIdValue || '');
    await keys_page.LOOKUP_KEY_BUTTON.click();
    await keys_page.isCouldNotRetrieveKeyDisplayed();
  });


});