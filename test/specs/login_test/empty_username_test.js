import { login_page } from '../../../lib/pom/Login_page';

describe('Test Login with empty username', () => {

  it('User cannot login witout providing username', () => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(null, envDetails.userPassword);
    let errorMessage = $('div*=Credentials are incorrect, please try again');
    wdioExpect(errorMessage).toBeDisplayed();
  });

});