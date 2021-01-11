class Page {
    get SUCCESS_POP_UPS_LIST() {return $$('.tyk-message--success');}
    get ERROR_POP_UPS_LIST() {return $$('.tyk-message--danger');}
  
    constructor() {
      console.log('Creating new page object model');
    }
  
    open(path) {
      console.log('>> Opening page ' + path);
      browser.url(path);
    }
  
    waitUntilPageLoaded(webElementOnPage, timeout) {
      return webElementOnPage.waitForExist({ timeout: timeout, timeoutMsg: 'Page not loaded! Element not visible!'});
    }
    
    isSuccessPopupDisplayedWithText(text) {
      console.debug(`>>> Looking for popup with text ${text}`);
      wdioExpect(this.SUCCESS_POP_UPS_LIST).toBeElementsArrayOfSize({ gte: 1 }); //checking if at least one pop up is displayed
      console.debug(`>>> Count of displayed popups: ${this.SUCCESS_POP_UPS_LIST.length}`);
      const popUpsWithExpectedText = this.SUCCESS_POP_UPS_LIST.filter(popup => {
        console.log(`>>> popup text: ${popup.getText()}`);
        return popup.getText() === text;
      }
        );
      return popUpsWithExpectedText.length >= 1;
    }

    isErrorPopupDisplayedWithText(text) {
      console.debug(`>>> Looking for error popup with text ${text}`);
      wdioExpect(this.ERROR_POP_UPS_LIST).toBeElementsArrayOfSize({ gte: 1 }); //checking if at least one pop up is displayed
      console.debug(`>>> Count of displayed error popups: ${this.ERROR_POP_UPS_LIST.length}`);
      const popUpsWithExpectedText = this.ERROR_POP_UPS_LIST.filter(popup => {
        console.log(`>>> error popup text: ${popup.getText()}`);
        return popup.getText() === text;
      }
        );
      return popUpsWithExpectedText.length >= 1;
    }

    isErrorPopUpDisplayed() {
      try {
        browser.waitUntil( () => this.ERROR_POP_UPS_LIST.length > 0);
        return true;
      } catch(e) {
        return false;}
    }

    getErrorPopUpText() {
      return this.ERROR_POP_UPS_LIST.map(popup => popup.getText());
    }
  }
  
  module.exports = Page;