import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { tib_page } from '../../../lib/pom/Tib_page';

let envDetails;
const samlProfile = {
  name: "user_name",
  type: "user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123",
  isUserAnAdmin: true
};

describe('Users creation', () => {
  
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  beforeEach(() => {
    main_page.openIdentityManagement();
    tib_page.CREATE_PROFILE_BUTTON.click();
  });

  it('User should be able to add SAML profile', () => {
    
  });

  it('User should be able to add LDAP profile', () => {
    
  });

  it('User should be able to add OpenID profile', () => {
    
  });

  it('User should be able to add Social profile', () => {
    
  });

});