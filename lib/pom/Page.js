class Page {
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
  
  }
  
  module.exports = Page;