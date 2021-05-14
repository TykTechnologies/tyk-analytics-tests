var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Table_object = require('ui_test_automation/wrappers/Table_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Tib_page extends Page {
    get CREATE_PROFILE_BUTTON() {return new Button_object('span*=Create Profile');}
    get PROFILE_NAME_INPUT() {return new Input_object('input[label="Name"]');}
    get PROFILE_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[1]');}
    get PROVIDER_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[2]');}
    get CERTIFICATE_DROPDOWN() {return new DropDown_object('span=Select a certificate');}
    get URL_INPUT() {return new Input_object('input[name="ProviderConfig.IDPMetaDataURL"]');}

    selectProviderByName(name) { 
        $(`//label[text()="${name}"]`).click(); 
    }

    get profile_created_expected_mesage() {return 'Profile created successfully';}
    isProfileCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.profile_created_expected_mesage);}
}
export const tib_page = new Tib_page();