import { Template_Page } from './Template_Page';
import { config } from '@variables';

export class Login_page extends Template_Page {    
  get USERNAME_INPUT() {return this.page.locator('input[name="username"]');}
  get PASSWORD_INPUT() {return this.page.locator('input[name="password"]');}
  get LOGIN_BUTTON() {return this.page.locator('button[type="submit"]');}

  async open() {
     await super.open(config.URL);
  }

  async login(userName = config.USER_EMAIL, password = config.USER_PASSWORD) {
    console.debug(`>>> Login as ${userName} and pass: ${password}`);
    await this.USERNAME_INPUT.fill(userName);
    await this.PASSWORD_INPUT.fill(password);

    await await this.LOGIN_BUTTON.click();
  }
}
     