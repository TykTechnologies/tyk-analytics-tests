import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { main_page } from '../../../lib/pom/Main_page';

describe('Create simple API', () => {
  const apiDetails = {
    name: "test"
  };
  let $apiTableElement;

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('User should be able to create new API', () => {
    main_page.openAPIs();
    apis_page.ADD_NEW_API_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue(apiDetails.name);
    browser.pause(2000);//TODO replace using wait
    apis_page.CONFIGURE_API_BUTTON.click();
    apis_page.SAVE_BUTTON.click();
  });

  it('New API should be visible in table', () => {
    $apiTableElement = $(`a=${apiDetails.name}`);  
    wdioExpect($apiTableElement).toBeClickable();
  });

  it('User should be able to delete API', () => {
    $apiTableElement.click();
    apis_page.OPTIONS_BUTTON.click();
    apis_page.DELETE_BUTTON.click();
    apis_page.DELETE_API_BUTTON.click();
  });

  it('Deleted API should not be visible', () => {
      wdioExpect($apiTableElement).not.toBeDisplayed();
  });
});