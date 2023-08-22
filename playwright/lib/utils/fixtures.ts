import { Locator, Page, test as base, expect } from '@playwright/test';
import { setUpEnv } from './prerequisites';

import { Login_page } from '@pom/Login_page';
import { Main_page } from '@pom/Main_page';






import { Wrapper } from '@wrappers/Wrapper';

export function assert(wrapper: Wrapper | Locator | Page | any) {
    if (wrapper instanceof Wrapper) {
        return expect(wrapper.element);
    } else {
    return expect(wrapper);
    }
}

export const test = base.extend<{
    createUserAndLogin: any,
    login_page: Login_page,
    main_page: Main_page,
}>({
    createUserAndLogin: async ({ page }, use: any) => {
        const userDetails = await setUpEnv();
        const login_page = new Login_page(page);
        await login_page.open();
        await login_page.login(userDetails.userEmail, userDetails.userPassword);
        console.log(`>>> User is logged in! User Email: ${userDetails.userEmail}`);
        use(userDetails);
    },
    login_page: async ({ page }, use) => {
        await use(new Login_page(page));
    },
    main_page: async ({ page }, use) => {
        await use(new Main_page(page));
    },

});


// export const test = base.extend<{ 
//     categories_page: Admin_categories_page,
//     admin_page: Admin_page,
//     posts_page: Admin_posts_page,
//     admin_tags_page: Admin_tags_page,
//     admin_users_page: Admin_users_page,
//     api_consumers_page: Api_consumers_page,
//     api_products_page: Api_products_page,
//     app_registration_page: App_registration_page,
//     apps_admin_page: Apps_admin_page
//     blog_page: Blog_page,
//     catalogues_page: Catalogues_page,
//     dev_analytics_page: Dev_analytics_page,
//     dev_apps_page: Dev_apps_page,
//     dev_cart_page: Dev_cart_page,
//     dev_catalogues_page: Dev_catalogues_page,
//     dev_my_dashboard_page: Dev_my_dashboard_page,
//     dev_products_page: Dev_products_page,
//     dev_users_page: Dev_users_page,
//     general_settings_page: General_settings_page,
//     invite_codes_page: Invite_codes_page,
//     keycloak_login_page: Keycloak_login_page,
//     login_page: Login_page,
//     main_page: Main_page,
//     org_page: Org_page,
//     plans_page: Plans_page,
//     portal_page: Portal_page,
//     providers_page: Providers_page,
//     provisioning_requests_page: Provisioning_requests_page,
//     registration_page: Registration_page,
//     sso_login_page: SSO_login_page,
//     teams_page: Teams_page,
//     themes_page: Themes_page,
//     welcome_page: Welcome_page,
//     steps: Steps,
//     gw_connection: GW_connection
// }>({
//     categories_page: async ({ page }, use) => {
//         await use(new Admin_categories_page(page));
//     },
//     admin_page: async ({ page }, use) => {
//         await use(new Admin_page(page));
//     },
//     posts_page: async ({ page }, use) => {
//         await use(new Admin_posts_page(page));
//     },
//     dev_apps_page: async ({ page }, use) => {
//         await use(new Dev_apps_page(page));
//     },
//     invite_codes_page: async ({ page }, use) => {
//         await use(new Invite_codes_page(page));
//     },
//     login_page: async ({ page }, use) => {
//         await use(new Login_page(page));
//     },
//     main_page: async ({ page }, use) => {
//         await use(new Main_page(page));
//     },
//     teams_page: async ({ page }, use) => {
//         await use(new Teams_page(page));
//     },
//     admin_tags_page: async ({ page }, use) => {
//         await use(new Admin_tags_page(page));
//     },
//     admin_users_page: async ({ page }, use) => {
//         await use(new Admin_users_page(page));
//     },
//     api_consumers_page: async ({ page }, use) => {
//         await use(new Api_consumers_page(page));
//     },
//     api_products_page: async ({ page }, use) => {
//         await use(new Api_products_page(page));
//     },
//     app_registration_page: async ({ page }, use) => {
//         await use(new App_registration_page(page));
//     },
//     //generate all missig pages
//     apps_admin_page: async ({ page }, use) => {
//         await use(new Apps_admin_page(page));
//     },
//     blog_page: async ({ page }, use) => {
//         await use(new Blog_page(page));
//     },
//     catalogues_page: async ({ page }, use) => {
//         await use(new Catalogues_page(page));
//     },
//     dev_analytics_page: async ({ page }, use) => {
//         await use(new Dev_analytics_page(page));
//     },
//     dev_cart_page: async ({ page }, use) => {
//         await use(new Dev_cart_page(page));
//     },
//     dev_catalogues_page: async ({ page }, use) => {
//         await use(new Dev_catalogues_page(page));
//     },
//     dev_my_dashboard_page: async ({ page }, use) => {
//         await use(new Dev_my_dashboard_page(page));
//     },
//     dev_products_page: async ({ page }, use) => {
//         await use(new Dev_products_page(page));
//     },
//     dev_users_page: async ({ page }, use) => {
//         await use(new Dev_users_page(page));
//     },
//     general_settings_page: async ({ page }, use) => {
//         await use(new General_settings_page(page));
//     },
//     keycloak_login_page: async ({ page }, use) => {
//         await use(new Keycloak_login_page(page));
//     },
//     org_page: async ({ page }, use) => {
//         await use(new Org_page(page));
//     },
//     plans_page: async ({ page }, use) => {
//         await use(new Plans_page(page));
//     },
//     portal_page: async ({ page }, use) => {
//         await use(new Portal_page(page));
//     },
//     providers_page: async ({ page }, use) => {
//         await use(new Providers_page(page));
//     },
//     provisioning_requests_page: async ({ page }, use) => {
//         await use(new Provisioning_requests_page(page));
//     },
//     registration_page: async ({ page }, use) => {
//         await use(new Registration_page(page));
//     },
//     sso_login_page: async ({ page }, use) => {
//         await use(new SSO_login_page(page));
//     },
//     themes_page: async ({ page }, use) => {
//         await use(new Themes_page(page));
//     },
//     welcome_page: async ({ page }, use) => {
//         await use(new Welcome_page(page));
//     },
//     steps: async ({ page }, use) => {
//         await use(new Steps(page));
//     },
//     gw_connection: async ({  }, use) => {
//         await use(new GW_connection());
//     }
// });
