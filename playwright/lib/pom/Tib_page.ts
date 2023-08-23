import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';

export class Tib_page extends Template_Page {
    get CREATE_PROFILE_BUTTON() {return new Button_object('span*=Create Profile', this.page);}
    get PROFILE_NAME_INPUT() {return new Input_object('input[label="Name"]', this.page);}
    get PROFILE_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[1]', this.page);}
    get PROVIDER_NEXT_BUTTON() {return new Button_object('(//span[text()="Next"])[2]', this.page);}
    get SAML_CERTIFICATE_DROPDOWN() {return new DropDown_object('span=Select a certificate', this.page);}
    get SAML_URL_INPUT() {return new Input_object('input[name="ProviderConfig.IDPMetaDataURL"]', this.page);}
    get LDAP_SERVER_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPServer"]', this.page);}
    get LDAP_PORT_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPPort"]', this.page);}
    get LDAP_USERDN_INPUT() {return new Input_object('input[name="ProviderConfig.LDAPUserDN"]', this.page);}
    get OICD_CLIENT_ID_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Key"]', this.page);}
    get OICD_CLIENT_SECRET_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Secret"]', this.page);}
    get OICD_DISCOVER_URL_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].DiscoverURL"]', this.page);}
    get SOCIAL_POLICY_DROPDOWN() {return this.page.locator('p').filter({ hasText: 'Select policy' });}
    get SOCIAL_PROVIDER_DROPDOWN() {return new DropDown_object('span=Select a provider', this.page);}
    get SOCIAL_CLIENT_ID_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Key"]', this.page);}
    get SOCIAL_CLIENT_SECRET_INPUT() {return new Input_object('input[name="ProviderConfig.UseProviders[0].Secret"]', this.page);}

    async selectProviderByName(name: any) { 
      await this.page.locator(`//label[text()="${name}"]`).click(); 
    }

    async selectFirstPolicyFromDropdown() {
        await this.page.locator('.tyk-combobox2__combobox-list').locator('li').first().click();
    }

    get profile_created_expected_mesage() {return 'Profile created successfully';}
    isProfileCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.profile_created_expected_mesage);}
}