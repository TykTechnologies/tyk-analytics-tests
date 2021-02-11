import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { users_page } from '../../../lib/pom/Users_page';
import { generateRandomEmail } from '../../../lib/utils/utils';

const userDetails = {
  firstName: "crud_user_name",
  firstNameUpdate: "crud_user_name_update",
  lastName: "crud_user_last_name",
  emailAdress: generateRandomEmail(),
  password: "test123"
};

describe('Create/update/delete users', () => {

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Admin should be able to create new user', () => {
    main_page.openUsers();
    users_page.ADD_USER_BUTTON.click();
    users_page.FIRST_NAME_INPUT.setValue(userDetails.firstName);
    users_page.LAST_NAME_INPUT.setValue(userDetails.lastName);
    users_page.EMAIL_ADRESS_INPUT.setValue(userDetails.emailAdress);
    users_page.PASSWORD_INPUT.setValue(userDetails.password);
    users_page.ACCOUNT_IS_ADMIN_CHECKBOX.click();
    users_page.SAVE_BUTTON.click();
    expect(users_page.isUserCreatedPopUpDisplayed()).to.be.true;
    users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    wdioExpect(users_page.EMAIL_ADRESS_INPUT).toHaveValue(userDetails.emailAdress);
  });

  it('Admin should be able to edit created user', () => {
    users_page.FIRST_NAME_INPUT.setValue(userDetails.firstNameUpdate);
    users_page.UPDATE_BUTTON.click();
    expect(users_page.isUserUpdatedPopUpDisplayed()).to.be.true;
    users_page.USERS_TABLE.clickCellWithText(userDetails.firstNameUpdate);
    wdioExpect(users_page.FIRST_NAME_INPUT).toHaveValue(userDetails.firstNameUpdate);
  });

  it('Admin should be able to delete user', () => {
    users_page.DELETE_BUTTON.click();
    const userIsNotVisibleInTable = users_page.USERS_TABLE.isCellWithTextNotDisplayed(userDetails.emailAdress);
    expect(userIsNotVisibleInTable).to.be.true;
  });

});