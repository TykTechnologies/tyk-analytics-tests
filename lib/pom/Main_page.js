var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
import { URL, LOGOUT_PATH } from './../../config_variables';

class Main_page extends Page {
  get PAGE_H1() {return $('h1*=API Activity Dashboard');}

  //NAVIGATION
  get APIs_NAVIAGTION_BUTTON() {return new Button_object('a[href="/apis"]');}
  get KEYS_NAVIAGTION_BUTTON() {return new Button_object('a[href="/keys"]');}
  get POLICIES_NAVIAGTION_BUTTON() {return new Button_object('a[href="/policies"]');}


  openAPIs() {
    this.APIs_NAVIAGTION_BUTTON.click();
  }

  openKeys() {
    this.KEYS_NAVIAGTION_BUTTON.click();
  }

  openPolicies() {
    this.POLICIES_NAVIAGTION_BUTTON.click();
  }

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.PAGE_H1);
  }

  logOut() {
    browser.url(URL + LOGOUT_PATH);
  }
}
export const main_page = new Main_page();