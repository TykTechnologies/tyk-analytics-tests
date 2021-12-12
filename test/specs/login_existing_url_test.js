import { login_page } from '../../lib/pom/Login_page';
import { main_page } from '../../lib/pom/Main_page';
import { users_page } from '../../lib/pom/Users_page';
import { URL } from './../../config_variables';

describe('Test navigation scenario when user sesion has expired', () => {
 
  it('Proper URL is opened after logging in', () => {
    const expectedEndpoint = 'users/add';
    const authCookie = 'authorisation';
    const pageTitle = $('h1=Add / Edit User');
    let envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    main_page.USERS_NAVIAGTION_BUTTON.click();
    browser.deleteCookies(authCookie);
    users_page.ADD_USER_BUTTON.click();
    wdioExpect(login_page.USERNAME_INPUT).toBeDisplayed();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    wdioExpect(browser).toHaveUrl(URL + expectedEndpoint);
    wdioExpect(pageTitle).toBeDisplayed();
  });

});