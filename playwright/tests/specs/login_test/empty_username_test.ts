import { test, assert } from '@fixtures';

test('Test Login with empty username', async ({ createUserAndLogin, main_page }) => {

  await test.step('User cannot login without providing username', async () => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(null, envDetails.userPassword);
    let errorMessage = await this.page.locator('div*=Credentials are incorrect, please try again');
    await assert(errorMessage).toBeDisplayed();
  });

});