var Page = require('./Page');
import { URL, USER_EMAIL, USER_PASSWORD } from './../../config_variables';

class Login_page extends Page {    
  get USERNAME_INPUT() {return $('input[name="username"]');}
  get PASSWORD_INPUT() {return $('input[name="password"]');}
  get LOGIN_BUTTON() {return $('button[type="submit"]');}

  open() {
     super.open(URL);
  }

  login(userName = USER_EMAIL, password = USER_PASSWORD) {
    console.debug(`Login as ${userName} and pass: ${password}`);
    this.USERNAME_INPUT.setValue(userName);
    this.PASSWORD_INPUT.setValue(password);

    this.LOGIN_BUTTON.click();
    wdioExpect($('span*=Dashboard')).toBeDisplayed({ message: 'Dashboard was not opened!!'});
  }

  waitUntilPageLoaded() {
    super.waitUntilPageLoaded(this.EMAIL_INPUT);
  }
}
export const login_page = new Login_page();
     