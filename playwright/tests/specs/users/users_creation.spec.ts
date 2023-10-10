import { test, assert } from '@fixtures';
import { generateRandomEmail } from '@lib/utils/utils';

const userDetails = {
  firstName: "user_name",
  lastName: "user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123",
  isUserAnAdmin: true
};
const invalidEmail = { emailAdress: "not_an_email" };
const shortPassword = { password: "test" };

test('Users creation', async ({ main_page, users_page, page }) => {

  const fillUserData = async (userDetailsObject: any) => {
    await users_page.ADD_USER_BUTTON.click();
    await users_page.FIRST_NAME_INPUT.fill(userDetailsObject.firstName);
    await users_page.LAST_NAME_INPUT.fill(userDetailsObject.lastName);
    await users_page.EMAIL_ADRESS_INPUT.fill(userDetailsObject.emailAdress);
    await users_page.PASSWORD_INPUT.fill(userDetailsObject.password);
    if (userDetailsObject.isUserAnAdmin) {
      await users_page.ACCOUNT_IS_ADMIN_CHECKBOX.check(); 
    }
  };

  await test.step('Admin should NOT be able to create user with invalid email', async () => {
    await main_page.openUsers();
    await fillUserData({ ...userDetails, ...invalidEmail });
    await users_page.SAVE_BUTTON.click();
    await users_page.checkIfErrorPopUpDisplayed();
    await main_page.openUsers();
    await users_page.USERS_TABLE.isCellWithTextNotDisplayed(invalidEmail.emailAdress);
  });

  await test.step('Admin should be able to create inactive user', async () => {
    await main_page.openUsers();
    await fillUserData(userDetails);
    await users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.uncheck();
    await users_page.SAVE_BUTTON.click();
    await users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    const isUserActive = await users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.isSelected();
    assert(isUserActive).toBeFalsy();
  });

  await test.step('Admin should NOT be able to create user with already existing email', async () => {
    await main_page.openUsers();
    await fillUserData(userDetails); //user with email in userDetails is already created
    await users_page.SAVE_BUTTON.click();
    assert(users_page.checkIfUserAlreadyExistsPopUpDisplayed()).toBeTruthy();
  });

  await test.step('Admin should NOT be able to create user with short password', async () => {
    await main_page.openUsers();
    await fillUserData({ ...userDetails, ...shortPassword });
    await users_page.SAVE_BUTTON.click();
    await users_page.checkIfErrorPopUpDisplayed();
  });

  await test.step('Admin should be able to create user with limited permissions', async () => {
    await main_page.openUsers();
    const userForPermissionsTest = {
      firstName: "user_permissions",
      lastName: "user_last_name",
      emailAdress: generateRandomEmail(),
      password: "test123",
    };
    await fillUserData(userForPermissionsTest);
    await users_page.selectReadAccessForPermission('analytics');
    await page.waitForTimeout(1000);
    await users_page.SAVE_BUTTON.click();

    await users_page.checkIfUserCreatedPopUpDisplayed();
    await main_page.openUsers();
    await users_page.USERS_TABLE.clickCellWithText(userForPermissionsTest.firstName);
    await assert(users_page.PERMISSIONS_ANALYTICS_ROW).toHaveValue('read');
  });
});
