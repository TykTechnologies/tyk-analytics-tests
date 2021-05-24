var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');

class Tib_page extends Page {
    get CREATE_PROFILE_BUTTON() {return new Button_object('span*=Create Profile');}
    get PROFILE_NAME_INPUT() {return new Input_object('input[label="Name"]');}
    get PROFILE_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[1]');}
    get PROVIDER_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[2]');}
    get SAML_CERTIFICATE_DROPDOWN() {return new DropDown_object('span=Select a certificate');}
    get SAML_URL_INPUT() {return new Input_object('input[name="ProviderConfig.IDPMetaDataURL"]');}
    get LDAP_SERVER_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPServer"]');}
    get LDAP_PORT_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPPort"]');}
    get LDAP_USERDN_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPUserDN"]');}
    get OICD_CLIENT_ID_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Key"]');}
    get OICD_CLIENT_SECRET_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Secret"]');}
    get OICD_DISCOVER_URL_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].DiscoverURL"]');}
    get SOCIAL_POLICY_DROPDOWN() {return $('span=Select policy');}
    get SOCIAL_PROVIDER_DROPDOWN() {return new DropDown_object('span=Select a provider');}
    get SOCIAL_CLIENT_ID_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Key"]');}
    get SOCIAL_CLIENT_SECRET_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Secret"]');}

    selectProviderByName(name) { 
        $(`//label[text()="${name}"]`).click(); 
    }

    selectFirstPolicyFromDropdown() {
        $('.tyk-combobox2__combobox-list').$$('li')[0].click();
    }

    get profile_created_expected_mesage() {return 'Profile created successfully';}
    isProfileCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.profile_created_expected_mesage);}
}
export const tib_page = new Tib_page();