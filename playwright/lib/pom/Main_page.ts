import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { config } from '@variables';

export class Main_page extends Template_Page {
  get PAGE_H1() {return this.page.locator('h1*=API Activity Dashboard');}

  //NAVIGATION
  get APIs_NAVIAGTION_BUTTON() {return new Button_object('a[href="/apis"]', this.page);}
  get KEYS_NAVIAGTION_BUTTON() {return new Button_object('a[href="/keys"]', this.page);}
  get POLICIES_NAVIAGTION_BUTTON() {return new Button_object('a[href="/policies"]', this.page);}
  get USERS_NAVIAGTION_BUTTON() {return new Button_object('a[href="/users"]', this.page);}
  get SETTINGS_NAVIAGTION_BUTTON() {return new Button_object('a[href="/portal-configuration"]', this.page);}
  get TIB_NAVIGATION_BUTTON() {return new Button_object('a[href="/tib/profiles"]', this.page);}
  get WEBHOOKS_NAVIGATION_BUTTON() {return new Button_object('a[href="/webhooks"]', this.page);}
  get CATALOGUE_NAVIGATION_BUTTON() {return new Button_object('a[href="/portal-catalogue"]', this.page);}


  async openAPIs() {
    await this.APIs_NAVIAGTION_BUTTON.click();
  }

  async openKeys() {
    await this.KEYS_NAVIAGTION_BUTTON.click();
  }

  async openPolicies() {
    await this.POLICIES_NAVIAGTION_BUTTON.click();
  }

  async openUsers() {
    await this.USERS_NAVIAGTION_BUTTON.click();
  }

  async openPortalSettings() {
    await this.SETTINGS_NAVIAGTION_BUTTON.click();
  }

  async openIdentityManagement() {
    await this.TIB_NAVIGATION_BUTTON.click();
  }

  async waitUntilPageLoaded() {
    await super.waitUntilPageLoaded(this.PAGE_H1);
  }

  async logOut() {
    await this.page.goto(config.URL + config.LOGOUT_PATH);
  }
  
  async openWebhooks() {
    await this.WEBHOOKS_NAVIGATION_BUTTON.click();
  }
  
  async openCatalogue(){
    await this.CATALOGUE_NAVIGATION_BUTTON.click();
  }

}