import { test, assert } from '@fixtures';
import { Login_page } from '@pom/Login_page';
import { setUpEnv } from '@lib/utils/prerequisites';

const path = require('path');


test('Import certificates', async ({ main_page, certificates_page, page }) => {
  const FileRelativePath = "./full_cert.pem"

  const userDetails = await setUpEnv();
  const login_page = new Login_page(page);
  await login_page.open();
  await login_page.login(userDetails.userEmail, userDetails.userPassword);
  console.log(`>>> User is logged in! User Email: ${userDetails.userEmail}`);


  const uploadZipFile = async (browser: any) => {
  //   const filePath = path.join(__dirname, "./full_cert.pem");
  //   console.log(`>>> Uploading certificate from path: ${filePath}`);

    // const remoteFilePath = browser.uploadFile(filePath);
    // await page.getByLabel('Upload certificate file').setInputFiles("./full_cert.pem");

    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent('filechooser');
    await certificates_page.UPLOAD_BUTTON.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, FileRelativePath));

  };

  await test.step('User should be able to import certificate', async () => {
    await main_page.openCertificates();
    await certificates_page.ADD_CERTIFICATE_BUTTON.click();
    await uploadZipFile(page); // pass the page argument to the function
    // await certificates_page.UPLOAD_BUTTON.click();
    await assert(certificates_page.ADDED_CERT_MESAGE_ALERT).toBeVisible();
  });

  await test.step('User should not be able to import duplicated certificate', async () => {
    await certificates_page.ADD_NEW_CERTIFICATE.click();
    await uploadZipFile(page); // pass the page argument to the function
    // await certificates_page.UPLOAD_BUTTON.click();
    await assert(certificates_page.UPLOAD_ERROR_MESSAGE).toBeVisible();
  });

  await test.step('User should be able to remove certificate', async () => {
    await certificates_page.BACK_BUTTON.click();
    await certificates_page.ACTIONS_BUTTON.click();
    await certificates_page.ACTIONS_VIEW_BUTTON.click();
    await certificates_page.DELETE_BUTTON.click();
    await certificates_page.POPUP_DELETE.click();
    await assert(certificates_page.REMOVED_CERT_MESSAGE_ALERT).toBeVisible();
  });
});

