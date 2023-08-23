import { test, assert } from '@fixtures';

import { users_page } from '../../../lib/pom/Users_page';
import { generateRandomEmail } from '../../../lib/utils/utils';

let envDetails;
const userDetails = {
  firstName: "user_name",
  lastName: "user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123",
  isUserAnAdmin: true
};
const invalidEmail = {emailAdress: "not_an_email"};
const shortPassword = {password: "test"};

test('Users creation', async ({ createUserAndLogin, main_page }) => {
  
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  beforeEach(() => {
    await main_page.openUsers();
   await users_page.ADD_USER_BUTTON.click();
  });

  await test.step('Admin should NOT be able to create user with invalid email', async () => {
    fillUserData({...userDetails, ...invalidEmail});
   await users_page.SAVE_BUTTON.click();

    assert(users_page.isErrorPopUpDisplayed()).toBeTruthy();
    await main_page.openUsers();
    const userIsNotVisibleInTable = users_page.USERS_TABLE.isCellWithTextNotDisplayed(invalidEmail.emailAdress);
    assert(userIsNotVisibleInTable).toBeTruthy();
  });

  await test.step('Admin should be able to create inactive user', async () => {
    fillUserData(userDetails);
   await users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.click();
   await users_page.SAVE_BUTTON.click();
   await users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    const isUserActive = users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.isSelected();
    assert(isUserActive).to.be.false;
  });

  await test.step('Admin should NOT be able to create user with already existing email', async () => {
    fillUserData(userDetails); //user with email in userDetails is already created
   await users_page.SAVE_BUTTON.click();
    assert(users_page.isUserAlreadyExistsPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Admin should NOT be able to create user with short password', async () => {
    fillUserData({...userDetails, ...shortPassword});
   await users_page.SAVE_BUTTON.click();
    assert(users_page.isErrorPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Admin should be able to create user with limited permissions', async () => {
    let userForPermissionsTest = {
      firstName: "user_permissions",
      lastName: "user_last_name",
      emailAdress: generateRandomEmail(),
      password: "test123",
    };
    fillUserData(userForPermissionsTest);
    users_page.selectReadAccessForPermission('analytics');
   await users_page.SAVE_BUTTON.click();
    
    assert(users_page.isUserCreatedPopUpDisplayed()).toBeTruthy();
    await main_page.openUsers();
   await users_page.USERS_TABLE.clickCellWithText(userForPermissionsTest.firstName);
    await assert(users_page.PERMISSIONS_ANALYTICS_ROW).toHaveValue('read');
  });
});

const fillUserData = (userDetailsObject) => {
 await users_page.FIRST_NAME_INPUT.fill(userDetailsObject.firstName);
 await users_page.LAST_NAME_INPUT.fill(userDetailsObject.lastName);
 await users_page.EMAIL_ADRESS_INPUT.fill(userDetailsObject.emailAdress);
 await users_page.PASSWORD_INPUT.fill(userDetailsObject.password);
  if (userDetailsObject.isUserAnAdmin) {users_page.ACCOUNT_IS_ADMIN_CHECKBOX.check();}
};
