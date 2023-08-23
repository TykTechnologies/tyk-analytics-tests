import { Locator, Page } from '@playwright/test';
import { assert } from 'console';
import { Wrapper } from 'tyk-test-automation-wrappers/lib/Wrapper';

export class Template_Page {
  readonly page: Page;  
  
  get SUCCESS_POP_UPS_LIST() {return this.page.locator('.tyk-message--success');}
  get ERROR_POP_UPS_LIST() {return this.page.locator('.tyk-message--danger');}

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    console.log('>> Opening page ' + path);
    await this.page.goto(path);
  }

  async waitUntilPageLoaded(webElementOnPage: Locator | Wrapper, timeout = 10000) {
    return await webElementOnPage.waitFor({ timeout: timeout});
  }
  
  // async isSuccessPopupDisplayedWithText(text: string) {
  //   console.debug(`>>> Looking for popup with text ${text}`);
  //   await assert(this.SUCCESS_POP_UPS_LIST).toBeElementsArrayOfSize({ gte: 1 }); //checking if at least one pop up is displayed
  //   try {
  //     browser.waitUntil( () =>
  //       this.SUCCESS_POP_UPS_LIST.filter(popup => popup.getText() === text).length > 0
  //     );
  //   } 
  //   catch(e) {
  //     console.debug(`Popup with text ${text} was not displayed`);
  //     return false;
  //   }
  //   return true;
  // }

  // isErrorPopupDisplayedWithText(text) {
  //   console.debug(`>>> Looking for error popup with text ${text}`);
  //   await assert(this.ERROR_POP_UPS_LIST).toBeElementsArrayOfSize({ gte: 1 }); //checking if at least one pop up is displayed
  //   console.debug(`>>> Count of displayed error popups: ${this.ERROR_POP_UPS_LIST.length}`);
  //   const popUpsWithExpectedText = this.ERROR_POP_UPS_LIST.filter(popup => {
  //     console.log(`>>> error popup text: ${popup.getText()}`);
  //     return popup.getText() === text;
  //   }
  //     );
  //   return popUpsWithExpectedText.length >= 1;
  // }

  // isErrorPopUpDisplayed() {
  //   try {
  //     browser.waitUntil( () => this.ERROR_POP_UPS_LIST.length > 0);
  //     return true;
  //   } catch(e) {
  //     return false;}
  // }

  // getErrorPopUpText() {
  //   return this.ERROR_POP_UPS_LIST.map(popup => popup.getText());
  // }
}