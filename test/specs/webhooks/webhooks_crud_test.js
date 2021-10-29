import { login_page } from '../../../lib/pom/Login_page';
import { main_page } from '../../../lib/pom/Main_page';
import { Dashboard_connection } from '../../../lib/utils/api_connections/Dashboard_connection';;
import {webhook_page} from '../../../lib/pom/Webhooks_page';

const NewWebhookDetails = {
    "name": "QA test",
    "RequestMethod":"GET",
    "Target": "http://test.com",
    "HeaderKey":"xyz",
    "HeaderValue":"123",
};

const UpdatedWebhookDetails = {
    "name": "Webhook",
    "RequestMethod": "POST",
    "Target": "http://test456.com",
};

const emptyWebhookMessage = "No data to display";


describe('Create/update/delete webhooks', () => {
    const dashboard_connection = new Dashboard_connection();
    let envDetails;
    before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

it('User should be able to add new webhook', ()=>{
    main_page.openWebhooks();
    webhook_page.ADD_WEBHOOK.click();
    webhook_page.NAME_INPUT.click();
    webhook_page.NAME_INPUT.setValue(NewWebhookDetails.name);
    webhook_page.REQUEST_METHOD_DROPDOWN.selectOption(NewWebhookDetails.RequestMethod);
    webhook_page.TARGET_INPUT.click();
    webhook_page.TARGET_INPUT.setValue(NewWebhookDetails.Target);
    webhook_page.HEADER_KEY.setValue(NewWebhookDetails.HeaderKey);
    webhook_page.HEADER_VALUE.setValue(NewWebhookDetails.HeaderValue);
    webhook_page.ADD_HEADER_BUTTON.click();
    webhook_page.SAVE_BUTTON.click();
});

it('User should be able to modify the webhook',()=>{
    webhook_page.WEBHOOK_TABLE.clickCellWithText(NewWebhookDetails.name);
    wdioExpect(webhook_page.NAME_INPUT).toHaveValue(NewWebhookDetails.name);
    wdioExpect(webhook_page.REQUEST_METHOD_DROPDOWN).toHaveValue(NewWebhookDetails.RequestMethod);
    wdioExpect(webhook_page.TARGET_INPUT).toHaveValue(NewWebhookDetails.Target);
    webhook_page.NAME_INPUT.setValue(UpdatedWebhookDetails.name);
    webhook_page.REQUEST_METHOD_DROPDOWN.selectOption(UpdatedWebhookDetails.RequestMethod);
    webhook_page.TARGET_INPUT.setValue(UpdatedWebhookDetails.Target);
    webhook_page.UPDATE_BUTTON.click();
    wdioExpect(webhook_page.NAME_INPUT).toHaveValue(UpdatedWebhookDetails.name);
    wdioExpect(webhook_page.REQUEST_METHOD_DROPDOWN).toHaveValue(UpdatedWebhookDetails.RequestMethod);
    wdioExpect(webhook_page.TARGET_INPUT).toHaveValue(UpdatedWebhookDetails.Target);
});

it('User must be able to delete webhook',()=>{
    webhook_page.DELETE_BUTTON.click();
    webhook_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    wdioExpect(webhook_page.NO_DATA_TO_DISPLAY).toHaveText(emptyWebhookMessage);
});

});