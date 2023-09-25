import { test, assert } from '@fixtures';

import { generateRandomEmail } from '../../../lib/utils/utils';

const userDetails = {
  firstName: "crud_user_name",
  firstNameUpdate: "crud_user_name_update",
  lastName: "crud_user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123"
};

test('Create/update/delete users', async ({ createUserAndLogin, main_page, users_page, page }) => {

  await test.step('Admin should be able to create new user', async () => {
    await main_page.openUsers();
    await users_page.ADD_USER_BUTTON.click();
    await users_page.FIRST_NAME_INPUT.fill(userDetails.firstName);
    await users_page.LAST_NAME_INPUT.fill(userDetails.lastName);
    await users_page.EMAIL_ADRESS_INPUT.fill(userDetails.emailAdress);
    await users_page.PASSWORD_INPUT.fill(userDetails.password);
    await users_page.ACCOUNT_IS_ADMIN_CHECKBOX.check();
    await users_page.SAVE_BUTTON.click();
    await users_page.checkIfUserCreatedPopUpDisplayed();
    await users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    await assert(users_page.EMAIL_ADRESS_INPUT).toHaveValue(userDetails.emailAdress);
  });

  await test.step('Admin should be able to edit created user', async () => {
    await users_page.FIRST_NAME_INPUT.fill(userDetails.firstNameUpdate);
    await users_page.UPDATE_BUTTON.click();
    await users_page.checkIfUserCreatedPopUpDisplayed();
    await main_page.openUsers();
    await users_page.USERS_TABLE.clickCellWithText(userDetails.firstNameUpdate);
    await assert(users_page.FIRST_NAME_INPUT).toHaveValue(userDetails.firstNameUpdate);
  });

  await test.step('Admin should be able to delete user', async () => {
    await users_page.DELETE_BUTTON.click();
    const userIsNotVisibleInTable = await users_page.USERS_TABLE.isCellWithTextNotDisplayed(userDetails.emailAdress);
    assert(userIsNotVisibleInTable).toBeTruthy();
  });

});