import { test, assert } from '@fixtures';
import { Dashboard_connection } from '@api_connections/Dashboard_connection';
import { newAPIdefinitionWithDefaults } from '@lib/utils/API_object_designer';

const authTokenApi = {
  "name": "authtoken",
  "use_keyless": false,
  "use_standard_auth": true
};

const apiKeysDetails = {
  apiName: 'keys_crud',
  keyExpiryTime: "1 hour",
  alias: 'test',
};

const updatedKeyDetails = {
  keyExpiryTimeUpdateValue: "6 hours",
  aliasUpdate: 'updateAlias',
  metadataKey: 'test',
  metadataValue: '123',
};


test('Create/update/delete keys without policy', async ({ createUserAndLogin, main_page, keys_page, page }) => {
  const dashboard_connection = new Dashboard_connection();

  await test.step('Prerequisits: creating API definition via dashboard API', async () => {
    const body = newAPIdefinitionWithDefaults(authTokenApi);
    await dashboard_connection.createAPI(body, createUserAndLogin.userSecret);
  });

  await test.step('User should be able to create new Key', async () => {
    await main_page.openKeys();
    await keys_page.ADD_KEY_BUTTON.click();
    await keys_page.CHOOSE_API_TOGGLE.click();
    await assert(keys_page.CHOOSE_API_TABLE).toContainText(authTokenApi.name);
    await keys_page.CHOOSE_API_TABLE.clickCellWithText(authTokenApi.name);
    await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    await keys_page.ALIAS_INPUT_FIELD.click();
    await keys_page.ALIAS_INPUT_FIELD.fill(apiKeysDetails.alias);
    await keys_page.KEY_EXPIRE_DROPDOWN.click();
    await keys_page.KEY_EXPIRE_DROPDOWN.selectOption(apiKeysDetails.keyExpiryTime);
    await keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
    await keys_page.CREATE_KEY_BUTTON.click();
    console.log('>>> Key was created');
    await keys_page.OK_BUTTON.click();
    await keys_page.isKeyCreatedPopUpDisplayed();
  });

  await test.step('User should be able to modify key', async () => {
    const keyHashValue: string = await keys_page.COPY_KEY_HASH_BUTTON.getAttribute('copy');
    assert(keyHashValue).not.toBeNull();
    await main_page.openKeys();
    await keys_page.KEY_SEARCH_FIELD.click();
    await keys_page.KEY_SEARCH_FIELD.fill(keyHashValue);
    await keys_page.LOOKUP_KEY_BUTTON.click();
    await keys_page.CONFIGURATIONS_TAB_BUTTON.click();
    const key = await keys_page.KEY_HASH_VALUE.getAttribute('copy');
    assert(key).toContain(keyHashValue);
    await assert(keys_page.UPDATE_BUTTON).toBeVisible();
    await assert(keys_page.UPDATE_WITHOUT_QUOTA_RESET_BUTTON).toBeVisible();
    await assert(keys_page.DELETE_BUTTON).toBeVisible();
    await assert(keys_page.ALIAS_INPUT_FIELD).toHaveValue(apiKeysDetails.alias);
    await keys_page.ALIAS_INPUT_FIELD.click();
    await keys_page.ALIAS_INPUT_FIELD.fill(updatedKeyDetails.aliasUpdate);
    await keys_page.ENABLE_DETAILED_LOGGING_BUTTON.click();
    await keys_page.METADATA_KEY_INPUT.fill(updatedKeyDetails.metadataKey);
    await keys_page.METADATA_VALUE_INPUT.fill(updatedKeyDetails.metadataValue);
    await keys_page.METADATA_ADD_BUTTON.click();
    await keys_page.KEY_EXPIRE_DROPDOWN.selectOption(updatedKeyDetails.keyExpiryTimeUpdateValue);
    await keys_page.UPDATE_BUTTON.click();
    await keys_page.CONFIRM_BUTTON.click();
    await assert(keys_page.ALIAS_INPUT_FIELD).toHaveValue(updatedKeyDetails.aliasUpdate);
  });

  await test.step('Confirmation popup should be displayed', async () => {
    assert(keys_page.isKeyUpdatedPopUpDisplayed()).toBeTruthy();
  });

  await test.step('User should be able to delete key', async () => {
    const DeletedKeyHashValue = await keys_page.KEY_HASH_VALUE.getAttribute('copy');
    assert(DeletedKeyHashValue).not.toBeNull();
    await keys_page.DELETE_BUTTON.click();
    await keys_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    await keys_page.isKeyDeletedPopUpDisplayed();
    await keys_page.KEY_SEARCH_FIELD.click();
    await keys_page.KEY_SEARCH_FIELD.fill(DeletedKeyHashValue);
    await keys_page.LOOKUP_KEY_BUTTON.click();
    await keys_page.isCouldNotRetrieveKeyDisplayed();
  });
});