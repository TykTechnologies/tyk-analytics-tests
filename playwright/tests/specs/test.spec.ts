import { test, assert } from 'lib/utils/fixtures';


test('Login/logout check', async ({ page, createUserAndLogin: createUserAndLogIn }) => {

    await test.step('Login', async () => {
        await assert(page).toHaveTitle('Tyk.io API Gateway');
    });

    
});