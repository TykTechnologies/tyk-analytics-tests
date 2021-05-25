import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { admin_settings_page } from '../../../lib/pom/portal/Admin_settings_page';

describe('Portal Settings - API access manipulations', () => {
  const redirectUrl = "http://test";
  const numberfAllowedRequests = "5";

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should see proper default values', () => {
    main_page.openPortalSettings();
    admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    expect(admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).to.be.false;
    expect(admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).to.be.false;
    expect(admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).to.be.false;
    wdioExpect(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue("0");
  });

  it('User should be able to edit all fields and save changes without error', () => {    
    admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.click();
    admin_settings_page.HIDE_API_SECRET_TOGGLE.click();
    admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.click();
    admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.click();
    admin_settings_page.REDIRECT_URL_INPUT.setValue(redirectUrl);
    admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT.setValue(numberfAllowedRequests);
    admin_settings_page.SAVE_BUTTON.click();
    expect(admin_settings_page.isSettingsUpdatedPopUpDisplayed()).to.be.true;
  });

  it('User should see saved values after re-load values', () => {
    browser.refresh();
    admin_settings_page.API_ACCESS_TAB_BUTTON.click();
    wdioExpect(admin_settings_page.REDIRECT_URL_INPUT).toHaveValue(redirectUrl);
    wdioExpect(admin_settings_page.NUMBER_OF_ALLOWED_REQUESTS_INPUT).toHaveValue(numberfAllowedRequests);
    expect(admin_settings_page.MANUAL_ACCESS_APPROVAL_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.HIDE_API_SECRET_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.MULTIPLE_API_SUBSCRIPTION_TOGGLE.isSelected()).to.be.true;
    expect(admin_settings_page.THIRD_PARTY_REDIRECT_TOGGLE.isSelected()).to.be.true;
  });
});