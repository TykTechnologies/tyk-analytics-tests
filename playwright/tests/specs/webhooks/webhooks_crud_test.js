import { test, assert } from '@fixtures';

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


test('Create/update/delete keys by ID without policy', async ({ createUserAndLogin, main_page }) => {
    const dashboard_connection = new Dashboard_connection();
    let envDetails;
    before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

it('User should be able to add new webhook', ()=>{
    main_page.openWebhooks();
   await webhook_page.ADD_WEBHOOK.click();
   await webhook_page.NAME_INPUT.click();
   await webhook_page.NAME_INPUT.fill(NewWebhookDetails.name);
   await webhook_page.REQUEST_METHOD_DROPDOWN.selectOption(NewWebhookDetails.RequestMethod);
   await webhook_page.TARGET_INPUT.click();
   await webhook_page.TARGET_INPUT.fill(NewWebhookDetails.Target);
   await webhook_page.HEADER_KEY.fill(NewWebhookDetails.HeaderKey);
   await webhook_page.HEADER_VALUE.fill(NewWebhookDetails.HeaderValue);
   await webhook_page.ADD_HEADER_BUTTON.click();
   await webhook_page.SAVE_BUTTON.click();
});

it('User should be able to modify the webhook',()=>{
   await webhook_page.WEBHOOK_TABLE.clickCellWithText(NewWebhookDetails.name);
    wdioExpect(webhook_page.NAME_INPUT).toHaveValue(NewWebhookDetails.name);
    wdioExpect(webhook_page.REQUEST_METHOD_DROPDOWN).toHaveValue(NewWebhookDetails.RequestMethod);
    wdioExpect(webhook_page.TARGET_INPUT).toHaveValue(NewWebhookDetails.Target);
   await webhook_page.NAME_INPUT.fill(UpdatedWebhookDetails.name);
   await webhook_page.REQUEST_METHOD_DROPDOWN.selectOption(UpdatedWebhookDetails.RequestMethod);
   await webhook_page.TARGET_INPUT.fill(UpdatedWebhookDetails.Target);
   await webhook_page.UPDATE_BUTTON.click();
    wdioExpect(webhook_page.NAME_INPUT).toHaveValue(UpdatedWebhookDetails.name);
    wdioExpect(webhook_page.REQUEST_METHOD_DROPDOWN).toHaveValue(UpdatedWebhookDetails.RequestMethod);
    wdioExpect(webhook_page.TARGET_INPUT).toHaveValue(UpdatedWebhookDetails.Target);
});

it('User must be able to delete webhook',()=>{
   await webhook_page.DELETE_BUTTON.click();
   await webhook_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
    wdioExpect(webhook_page.NO_DATA_TO_DISPLAY).toHaveText(emptyWebhookMessage);
});

});