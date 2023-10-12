import { Locator, Page, expect } from '@playwright/test';
import { Wrapper } from '@wrappers/Wrapper';

export class Template_Page {
  readonly page: Page;  
  
  get SUCCESS_POP_UPS_LIST() { return this.page.locator('.tyk-message--success'); }
  get ERROR_POP_UPS_LIST() { return this.page.locator('.tyk-message--danger'); }

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    console.log('>> Opening page ' + path);
    await this.page.goto(path);
  }

  async waitUntilPageLoaded(webElementOnPage: Locator | Wrapper, timeout = 10000) {
    return await webElementOnPage.waitFor({ timeout: timeout });
  }
  
  async checkIfSuccessPopupDisplayedWithText(text: string): Promise<void> {
    console.debug(`>>> Looking for popup with text ${text}`);
    await this.SUCCESS_POP_UPS_LIST.first().waitFor();
    await expect.poll( async () => {
      const popUps = await this.SUCCESS_POP_UPS_LIST.all();
      for (const popUp of popUps) {
        console.debug(`>>> success popup text: ${await popUp.textContent()}`);
        if (await popUp.textContent() === text) {
          return true;
        }
      }
      return false;
    }).toBeTruthy();
  }

  async isErrorPopupDisplayedWithText(text: string): Promise<void> {
    console.debug(`>>> Looking for popup with text ${text}`);
    await expect.poll( async () => {
      await this.ERROR_POP_UPS_LIST.first().waitFor();
      const popUps = await this.ERROR_POP_UPS_LIST.all();
      for (const popUp of popUps) {
        console.debug(`>>> success popup text: ${await popUp.textContent()}`);
        if (await popUp.textContent() === text) {
          return true;
        }
      }
      return false;
    }).toBeTruthy();
  }

  async checkIfErrorPopUpDisplayed() {
    await expect.poll( async () => {
      if (await this.ERROR_POP_UPS_LIST.count() > 0) {
        return true;
      }
      return false;
    }).toBeTruthy();
  }

  async getErrorPopUpText() {
    const popUps = await this.ERROR_POP_UPS_LIST.all();
    const errorText = [];  
    for (const popUp of popUps) {
      console.debug(`>>> error popup text: ${await popUp.textContent()}`);
      errorText.push(await popUp.textContent());
    }
    return errorText;
  }
}