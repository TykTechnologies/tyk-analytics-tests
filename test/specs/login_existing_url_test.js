import { login_page } from '../../lib/pom/Login_page';
import { URL } from './../../config_variables';

describe('Test CORS settings on OAS API designer page', () => {
 
  it('When sesion is expired proper URL is opened after logging in', () => {
    const expectedEndpoint = 'users/add';
    const authCookie = 'authorisation';
    const pageTitle = $('h1=Add / Edit User');
    let envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    browser.deleteCookies(authCookie);
    browser.navigateTo(URL + expectedEndpoint);
    wdioExpect(login_page.USERNAME_INPUT).toBeDisplayed();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    wdioExpect(browser).toHaveUrl(URL + expectedEndpoint);
    wdioExpect(pageTitle).toBeDisplayed();
  });

});