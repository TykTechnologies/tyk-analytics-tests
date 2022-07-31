
import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_Page';
import {certs_page} from '../../../lib/pom/Certificates_page';
import { path } from 'chromedriver';
import Input_object from 'ui_test_automation/wrappers/Input_object';

describe('Import certificates', () => {

    before(() => {
        const envDetails = setUpEnv();
        login_page.open();
        login_page.login(envDetails.userEmail, envDetails.userPassword);
    });  

  it('User should be able to import certificate', () => {
    const filePath = path.join(__dirname, '../certs/cert.pem');
    const remoteFilePath = browser.uploadFile(filePath);
    const chooseFile = certs_page.CHOOSE_FILE_BUTTON;
    main_page.openCertificates();
    certs_page.ADD_CERTIFICATE_BUTTON.click();
    chooseFile.setValue(remoteFilePath);
    certs_page.UPLOAD_BUTTON();
    browser.pause(5000);




  });

  it('User should be able to remove certificate', () => {

  });
});