import { login_page } from '../../lib/pom/Login_page';
import { URL } from './../../config_variables';

describe('Test opening nested page when user is not logged in', () => {
 
  it('Proper URL is opened after logging in', () => {
    const expectedEndpoint = 'users/add';
    const pageTitle = $('h1=Add / Edit User');
    let envDetails = setUpEnv();
    browser.navigateTo(URL + expectedEndpoint);
    login_page.login(envDetails.userEmail, envDetails.userPassword);
    wdioExpect(browser).toHaveUrl(URL + expectedEndpoint);
    wdioExpect(pageTitle).toBeDisplayed();
  });

});