import { Locator, Page, test as base, expect } from '@playwright/test';
import { setUpEnv } from './prerequisites';
import { Login_page } from '@pom/Login_page';
import { Main_page } from '@pom/Main_page';
import { Wrapper } from '@wrappers/Wrapper';
import { Apis_page } from '@pom/Apis_page';
import { Catalogue_page } from '@pom/Catalogue_page';
import { Endpoints_page } from '@pom/Endpoints_page';
import { Graphql_page } from '@pom/Graphql_page';
import { Keys_page } from '@pom/Keys_page';
import { Policies_page } from '@pom/Policies_page';
import { Tib_page } from '@pom/Tib_page';
import { Users_page } from '@pom/Users_page';
import { Webhooks_page } from '@pom/Webhooks_page';
import { Admin_settings_page } from '@lib/pom/portal/Admin_settings_page';
import { Certificates_page } from '@pom/Certificates_page';

export function assert(wrapper: Wrapper | Locator | any) {
    if (wrapper instanceof Wrapper) {
        return expect(wrapper.element);
    } else {
        return expect(wrapper);
    }
}

export const test = base.extend<{
    createUserAndLogin: any,
    apis_page: Apis_page
    catalogue_page: Catalogue_page,
    endpoints_page: Endpoints_page,
    graphql_page: Graphql_page,
    keys_page: Keys_page,
    login_page: Login_page,
    main_page: Main_page,
    policies_page: Policies_page,
    tib_page: Tib_page,
    users_page: Users_page,
    webhooks_page: Webhooks_page,
    admin_settings_page: Admin_settings_page
    certificates_page: Certificates_page
}>({
    createUserAndLogin: async ({ page }, use: any) => {
        const userDetails = await setUpEnv();
        const login_page = new Login_page(page);
        await login_page.open();
        await login_page.login(userDetails.userEmail, userDetails.userPassword);
        console.log(`>>> User is logged in! User Email: ${userDetails.userEmail}`);
        use(userDetails);
    },
    apis_page: async ({ page }, use) => {
        await use(new Apis_page(page));
    },
    catalogue_page: async ({ page }, use) => {
        await use(new Catalogue_page(page));
    },
    endpoints_page: async ({ page }, use) => {
        await use(new Endpoints_page(page));
    },
    graphql_page: async ({ page }, use) => {
        await use(new Graphql_page(page));
    },
    keys_page: async ({ page }, use) => {
        await use(new Keys_page(page));
    },
    login_page: async ({ page }, use) => {
        await use(new Login_page(page));
    },
    main_page: async ({ page }, use) => {
        await use(new Main_page(page));
    },
    policies_page: async ({ page }, use) => {
        await use(new Policies_page(page));
    },
    tib_page: async ({ page }, use) => {
        await use(new Tib_page(page));
    },
    users_page: async ({ page }, use) => {
        await use(new Users_page(page));
    },
    webhooks_page: async ({ page }, use) => {
        await use(new Webhooks_page(page));
    },
    admin_settings_page: async ({ page }, use) => {
        await use(new Admin_settings_page(page));
    },
    certificates_page: async ({ page }, use) => {
        await use(new Certificates_page(page));
    }
});