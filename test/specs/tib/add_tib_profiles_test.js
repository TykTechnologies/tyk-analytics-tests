import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { tib_page } from '../../../lib/pom/Tib_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';

let envDetails;
const certFileLocation = './test/specs/tib/public_key.pem';
const samlProfile = {
  name: "samlProfile",
  type: "SAML",
  url: "https://cosiek.com"
};

describe('Users creation', () => {
  const dashboard_connection = new Dashboard_connection();

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
    dashboard_connection.uploadCert(certFileLocation, envDetails.userSecret)
    tib_page.PROFILE_NAME_INPUT.setValue(samlProfile.name);
    tib_page.PROFILE_NEXT_BUTTON.click();
    tib_page.selectProviderByName(samlProfile.type);
    tib_page.PROVIDER_NEXT_BUTTON.click();
    tib_page.CERTIFICATE_DROPDOWN.selectFirstOption();
    tib_page.URL_INPUT.setValue(samlProfile.url);
    tib_page.CREATE_PROFILE_BUTTON.click();
    expect(tib_page.isProfileCreatedPopUpDisplayed()).to.be.true;
  });
/*
  it('User should be able to add LDAP profile', () => {
    
  });

  it('User should be able to add OpenID profile', () => {
    
  });

  it('User should be able to add Social profile', () => {
    
  });
*/
});