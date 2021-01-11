import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { users_page } from '../../../lib/pom/Users_page';
const randomEmail = require('random-email');

let envDetails;
const userDetails = {
  firstName: "user_name",
  lastName: "user_last_name",
  emailAdress: randomEmail(),
  password: "test123",
  isUserAnAdmin: true
};
const invalidEmail = {emailAdress: "not_an_email"};
const shortPassword = {password: "test"};

describe('Users creation', () => {
  
  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  beforeEach(() => {
    main_page.openUsers();
    users_page.ADD_USER_BUTTON.click();
  });

  it('Admin should NOT be able to create user with invalid email', () => {
    fillUserData({...userDetails, ...invalidEmail});
    users_page.SAVE_BUTTON.click();

    expect(users_page.isErrorPopUpDisplayed()).to.be.true;
    main_page.openUsers();
    const userIsNotVisibleInTable = users_page.USERS_TABLE.isCellWithTextNotDisplayed(invalidEmail.emailAdress);
    expect(userIsNotVisibleInTable).to.be.true;
  });

  it('Admin should be able to create inactive user', () => {
    fillUserData(userDetails);
    users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.click();
    users_page.SAVE_BUTTON.click();
    users_page.USERS_TABLE.clickCellWithText(userDetails.firstName);
    const isUserActive = users_page.ACCOUNT_IS_ACTIVE_CHECKBOX.isSelected();
    expect(isUserActive).to.be.false;
  });

  it('Admin should NOT be able to create user with already existing email', () => {
    fillUserData(userDetails); //user with email in userDetails is already created
    users_page.SAVE_BUTTON.click();
    expect(users_page.isUserAlreadyExistsPopUpDisplayed()).to.be.true;
  });

  it('Admin should NOT be able to create user with short password', () => {
    fillUserData({...userDetails, ...shortPassword});
    users_page.SAVE_BUTTON.click();
    expect(users_page.isErrorPopUpDisplayed()).to.be.true;
  });

  it('Admin should be able to create user with limited permissions', () => {
    let userForPermissionsTest = {
      firstName: "user_permissions",
      lastName: "user_last_name",
      emailAdress: randomEmail(),
      password: "test123",
    };
    fillUserData(userForPermissionsTest);
    users_page.selectReadAccessForPermission('analytics');
    users_page.SAVE_BUTTON.click();

    main_page.openUsers();
    users_page.USERS_TABLE.clickCellWithText(userForPermissionsTest.firstName);
    wdioExpect(users_page.PERMISSIONS_ANALYTICS_ROW).toHaveValue('read');
  });
});

const fillUserData = (userDetailsObject) => {
  users_page.FIRST_NAME_INPUT.setValue(userDetailsObject.firstName);
  users_page.LAST_NAME_INPUT.setValue(userDetailsObject.lastName);
  users_page.EMAIL_ADRESS_INPUT.setValue(userDetailsObject.emailAdress);
  users_page.PASSWORD_INPUT.setValue(userDetailsObject.password);
  if (userDetailsObject.isUserAnAdmin) {users_page.ACCOUNT_IS_ADMIN_CHECKBOX.check();}
};
