const Page = require('../Page');
const Button_object = require('ui_test_automation/wrappers/Button_object');
const Input_object = require('ui_test_automation/wrappers/Input_object');
const Toggle_object = require('ui_test_automation/wrappers/Toggle_object');
const DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
const Table_object = require('ui_test_automation/wrappers/Table_object');

class Admin_settings_page extends Page {
  get SAVE_BUTTON() {return new Button_object('#save-portal-settings-btn');}    
  //TABS BUTTONS
  get ADMIN_TAB_BUTTON() {return new Button_object('button=Admin');}    
  get API_ACCESS_TAB_BUTTON() {return new Button_object('button=API Access');}    
  get EMAILS_TAB_BUTTON() {return new Button_object('button=Emails');}    
  get FORMS_TAB_BUTTON() {return new Button_object('button=Forms');}
  //ADMIN
  get ACCESS_REQUEST_INPUT() {return new Input_object('#access-request');}
  get DEVELOPER_SIGN_UP_TOGGLE() {return new Toggle_object('input[name="disable_signup"]');}
  get DEVELOPER_LOGIN_TOGGLE() {return new Toggle_object('input[name="disable_login"]');}
  get RESTRICTED_CATALOGUE_TOGGLE() {return new Toggle_object('input[name="catalogue_login_only"]');}
  //API ACCESS
  get MANUAL_ACCESS_APPROVAL_TOGGLE() {return new Toggle_object('input[name="require_key_approval"]');}
  get HIDE_API_SECRET_TOGGLE() {return new Toggle_object('input[name="secure_key_approval"]');}
  get MULTIPLE_API_SUBSCRIPTION_TOGGLE() {return new Toggle_object('input[name="enable_multi_selection"]');}
  get THIRD_PARTY_REDIRECT_TOGGLE() {return new Toggle_object('input[name="redirect_on_key_request"]');}
  get REDIRECT_URL_INPUT() {return new Input_object('#redirect_to');}
  get NUMBER_OF_ALLOWED_REQUESTS_INPUT() {return new Input_object('#oauth_usage_limit');}
  //DCR
  get DCR_TOGGLE() {return new Toggle_object('input[name="enable_dcr"]');}
  get DCR_PROVIDERS_DROPDOWN() {return new DropDown_object('#configuration-dcr-provider');}
  get DCR_GRANT_TYPES_DROPDOWN() {return new DropDown_object('#configuration-dcr-grant-type');}
  get DCR_TOKEN_ENDPOINT_DROPDOWN() {return new DropDown_object('#configuration-dcr-provider-auth-method');}
  get DCR_RESPONSE_TYPE_DROPDOWN() {return new DropDown_object('#configuration-dcr-response-type');}
  get DCR_HOST_INPUT() {return new Input_object('#configuration-dcr-idp-host');}
  get DCR_CLIENT_REGISTRATION_ENDPOINT_INPUT() {return new Input_object('#configuration-dcr-registration-endpoint');}
  get DCR_TOKEN_INPUT() {return new Input_object('#configuration-dcr-access-token');}
  //EMAILS
  get GLOBAL_EMAIL_SETTINGS_BUTTON() {return new Button_object('h3=Global Email Settings');}    
  get FROM_ADDRESS_INPUT() {return new Input_object('input[name="mail_options.mail_from_email"]');}
  get NAME_OF_SENDER_INPUT() {return new Input_object('input[name="mail_options.mail_from_name"]');}
  get RESET_ALL_EMAILS_BUTTON() {return new Button_object('#reset-emails-btn');}    
  get CONTINUE_AND_RESET_BUTTON() {return new Button_object('span=Continue and Reset');}    
  get EDIT_GLOBAL_EMAIL_CSS_BUTTON() {return new Button_object('#edit-css-btn');}    
  get TABLE() {return new Table_object('.tyk-table');}
  get EXIT_CSS_EDITOR_BUTTON() {return new Button_object('#exit-email-editor-btn');} 
  get SAVE_EMAIL_CSS_BUTTON() {return new Button_object('#save-email-settings-btn');} 
  get CSS_EDITOR_INPUT() {return new Input_object('#email_css textarea');}
  //EMAILS editor
  get EMAILS_OPTIONS_ENABLE_TOGGLE() {return new Toggle_object('input[type="checkbox"]');}
  get EMAIL_OPTIONS_SUBJECT_INPUT() {return new Input_object('#welcome_email-subject');}
  get EMAIL_OPTIONS_BODY_INPUT() {return new Input_object('.ql-editor');}
  get EMAIL_OPTIONS_SIGNOFF_INPUT() {return new Input_object('textarea[name*="sign_off"]');}
  get EMAIL_OPTIONS_SAVE_BUTTON() {return new Button_object('span=SAVE CHANGES');}
  //CONST
  get updatedConfigurationMessageText() {return 'Portal configuration updated';}
  
  waitUntilPageLoaded() {
    super.waitUntilPageLoaded(this.ADMIN_TAB_BUTTON);
  }

  isSettingsUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.updatedConfigurationMessageText);}
}
export const admin_settings_page = new Admin_settings_page();
     