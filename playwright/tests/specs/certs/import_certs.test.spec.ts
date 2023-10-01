
import { test, assert } from '@lib/utils/fixtures';

const path = require('path');


test('Import certificates', async ({ main_page, certs_page, page }) => {
  const FileRelativePath = "./full-cert.pem";

  before(() => {
    const envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });  

  await test.step('User should be able to import certificate', async () => {
    await main_page.openCertificates();
    certs_page.ADD_CERTIFICATE_BUTTON.click();
    uploadZipFile();
    certs_page.UPLOAD_BUTTON.click();
    wdioExpect(certs_page.ADDED_CERT_MESAGE_ALERT).toBeDisplayed();
  });

  it('User should not be able to import duplicated certificate', () => {
    certs_page.ADD_NEW_CERTIFICATE.click();
    uploadZipFile();
    certs_page.UPLOAD_BUTTON.click();
    wdioExpect(certs_page.UPLOAD_ERROR_MESSAGE).toBeDisplayed();
  });

  it('User should be able to remove certificate', () => {
    certs_page.BACK_BUTTON.click();
    certs_page.ACTIONS_BUTTON.click();
    certs_page.ACTIONS_VIEW_BUTTON.click();
    certs_page.DELETE_BUTTON.click();
    certs_page.POPUP_DELETE.click();
    wdioExpect(certs_page.REMOVED_CERT_MESSAGE_ALERT).toBeDisplayed();
  });

  const uploadZipFile = () => {
    const filePath = path.join(__dirname, FileRelativePath);
    console.log('>>> Uploading certificate from path: ${filePath}');
    const remoteFilePath = browser.uploadFile(filePath);
    certs_page.CHOOSE_FILE_BUTTON.setValue(remoteFilePath);
  };
});