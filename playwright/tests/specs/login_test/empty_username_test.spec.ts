import { test, assert } from '@fixtures';

test('Test Login with empty username', async ({ createUserAndLogin, main_page, login_page, page }) => {

  await test.step('User cannot login without providing username', async () => {
    await main_page.logOut();
    await login_page.open();
    await login_page.login("", createUserAndLogin.userPassword);
    const errorMessage = page.locator('div:text-is("Credentials are incorrect, please try again")');
    await assert(errorMessage).toBeVisible();
  });

});