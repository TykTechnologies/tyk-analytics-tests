import { Template_Page } from '../Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { SlowButton_object } from '@wrappers/SlowButton_object';
import { Input_object } from '@wrappers/Input_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Table_object } from '@wrappers/Table_object';
import { Toggle_object } from '@wrappers/Toggle_object';

export class Admin_settings_page extends Template_Page {
  get SAVE_BUTTON() { return new SlowButton_object('#save-portal-settings-btn', this.page); }    
  //TABS BUTTONS
  get ADMIN_TAB_BUTTON() { return new Button_object('button:text("Admin")', this.page); }    
  get API_ACCESS_TAB_BUTTON() { return new Button_object('button:text("API Access")', this.page); }    
  get EMAILS_TAB_BUTTON() { return new Button_object('button:text("Emails")', this.page); }    
  get FORMS_TAB_BUTTON() { return new Button_object('button:text("Forms")', this.page); }
  //ADMIN
  get ACCESS_REQUEST_INPUT() { return new Input_object('#access-request', this.page); }
  get DEVELOPER_SIGN_UP_TOGGLE() { return new Toggle_object('input[name="disable_signup"]', this.page); }
  get DEVELOPER_LOGIN_TOGGLE() { return new Toggle_object('input[name="disable_login"]', this.page); }
  get RESTRICTED_CATALOGUE_TOGGLE() { return new Toggle_object('input[name="catalogue_login_only"]', this.page); }
  //API ACCESS
  get MANUAL_ACCESS_APPROVAL_TOGGLE() { return new Toggle_object('input[name="require_key_approval"]', this.page); }
  get HIDE_API_SECRET_TOGGLE() { return new Toggle_object('input[name="secure_key_approval"]', this.page); }
  get MULTIPLE_API_SUBSCRIPTION_TOGGLE() { return new Toggle_object('input[name="enable_multi_selection"]', this.page); }
  get THIRD_PARTY_REDIRECT_TOGGLE() { return new Toggle_object('input[name="redirect_on_key_request"]', this.page); }
  get REDIRECT_URL_INPUT() { return new Input_object('#redirect_to', this.page); }
  get NUMBER_OF_ALLOWED_REQUESTS_INPUT() { return new Input_object('#oauth_usage_limit', this.page); }
  //DCR
  get DCR_TOGGLE() { return new Toggle_object('input[name="enable_dcr"]', this.page); }
  get DCR_PROVIDERS_DROPDOWN() { return new DropDown_object('#configuration-dcr-provider', this.page); }
  get DCR_GRANT_TYPES_DROPDOWN() { return new DropDown_object('#configuration-dcr-grant-type', this.page); }
  get DCR_TOKEN_ENDPOINT_DROPDOWN() { return new DropDown_object('#configuration-dcr-provider-auth-method', this.page); }
  get DCR_RESPONSE_TYPE_DROPDOWN() { return new DropDown_object('#configuration-dcr-response-type', this.page); }
  get DCR_HOST_INPUT() { return new Input_object('#configuration-dcr-idp-host', this.page); }
  get DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT() { return new Input_object('#configuration-dcr-registration-endpoint', this.page); }
  get DCR_TOKEN_INPUT() { return new Input_object('#configuration-dcr-access-token', this.page); }
  //EMAILS
  get GLOBAL_EMAIL_SETTINGS_BUTTON() { return new Button_object('h3:text("Global Email Settings")', this.page); }    
  get FROM_ADDRESS_INPUT() { return new Input_object('input[name="mail_options.mail_from_email"]', this.page); }
  get NAME_OF_SENDER_INPUT() { return new Input_object('input[name="mail_options.mail_from_name"]', this.page); }
  get RESET_ALL_EMAILS_BUTTON() { return new Button_object('#reset-emails-btn', this.page); }    
  get CONTINUE_AND_RESET_BUTTON() { return new Button_object(this.page.locator('span').filter({ hasText:'Continue and Reset' }), this.page); }    
  get EDIT_GLOBAL_EMAIL_CSS_BUTTON() { return new Button_object('#edit-css-btn', this.page); }    
  get TABLE() { return new Table_object('.tyk-table', this.page); }
  get EXIT_CSS_EDITOR_BUTTON() { return new Button_object('#exit-email-editor-btn', this.page); } 
  get SAVE_EMAIL_CSS_BUTTON() { return new SlowButton_object('#save-email-settings-btn', this.page); } 
  get CSS_EDITOR_INPUT() { return new Input_object('#email_css textarea', this.page); }
  //EMAILS editor
  get EMAILS_OPTIONS_ENABLE_TOGGLE() { return new Toggle_object('input[type="checkbox"]', this.page); }
  get EMAIL_OPTIONS_SUBJECT_INPUT() { return new Input_object('#welcome_email-subject', this.page); }
  get EMAIL_OPTIONS_BODY_INPUT() { return new Input_object('.ql-editor', this.page); }
  get EMAIL_OPTIONS_SIGNOFF_INPUT() { return new Input_object('textarea[name*="sign_off"]', this.page); }
  get EMAIL_OPTIONS_SAVE_BUTTON() { return new SlowButton_object(this.page.locator('span').filter({ hasText:'SAVE CHANGES' }), this.page); }
  //CONST
  get updatedConfigurationMessageText() { return 'Portal configuration updated'; }

  async checkIfSettingsUpdatedPopUpDisplayed() { return await this.checkIfSuccessPopupDisplayedWithText(this.updatedConfigurationMessageText); }
}
     