import { test, assert } from '@fixtures';

import { users_page } from '../../../lib/pom/Users_page';
import { generateRandomEmail } from '../../../lib/utils/utils';

const userDetails = {
  firstName: "crud_user_name",
  firstNameUpdate: "crud_user_name_update",
  lastName: "crud_user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123"
};

test('Create/update/delete users', async ({ createUserAndLogin, main_page }) => {

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  await test.step('Admin should be able to create new user', async () => {
    main_page.openUsers();
   await users_page.ADD_USER_BUTTON.click();
   await users_page.FIRST_NAME_INPUT.fill(userDetails.firstName);
   await users_page.LAST_NAME_INPUT.fill(userDetails.lastName);
   await users_page.EMAIL_ADRESS_INPUT.fill(userDetails.emailAdress);
   await users_page.PASSWORD_INPUT.fill(userDetails.password);
   await users_page.ACCOUNT_IS_ADMIN_CHECKBOX.click();
   await users_page.SAVE_BUTTON.click();
    expect(users_page.isUserCreatedPopUpDisplayed()).to.be.true;
   await users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    wdioExpect(users_page.EMAIL_ADRESS_INPUT).toHaveValue(userDetails.emailAdress);
  });

  await test.step('Admin should be able to edit created user', async () => {
   await users_page.FIRST_NAME_INPUT.fill(userDetails.firstNameUpdate);
   await users_page.UPDATE_BUTTON.click();
    expect(users_page.isUserUpdatedPopUpDisplayed()).to.be.true;
    main_page.openUsers();
   await users_page.USERS_TABLE.clickCellWithText(userDetails.firstNameUpdate);
    wdioExpect(users_page.FIRST_NAME_INPUT).toHaveValue(userDetails.firstNameUpdate);
  });

  await test.step('Admin should be able to delete user', async () => {
   await users_page.DELETE_BUTTON.click();
    const userIsNotVisibleInTable = users_page.USERS_TABLE.isCellWithTextNotDisplayed(userDetails.emailAdress);
    expect(userIsNotVisibleInTable).to.be.true;
  });

});