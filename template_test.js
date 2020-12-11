
import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_Page';

describe('HIGH LEVEL DESCRIPTION OF FEATURE', () => {

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });  

  it('User should be able to.....', () => {

  });

  it('User should be able to......', () => {

  });
});