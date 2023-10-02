import { test, assert } from '@fixtures';

import { Dashboard_connection } from '@api_connections/Dashboard_connection';

const NewWebhookDetails = {
    "name": "QA test",
    "RequestMethod": "GET",
    "Target": "http://test.com",
    "HeaderKey": "xyz",
    "HeaderValue": "123",
};

const UpdatedWebhookDetails = {
    "name": "Webhook",
    "RequestMethod": "POST",
    "Target": "http://test456.com",
};

const emptyWebhookMessage = "No data to display";

test('CRUD operation on webhook', async ({ createUserAndLogin, main_page, webhooks_page }) => {

    await test.step('User should be able to add new webhook', async () => {
        await main_page.openWebhooks();
        await webhooks_page.ADD_WEBHOOK.click();
        await webhooks_page.NAME_INPUT.click();
        await webhooks_page.NAME_INPUT.fill(NewWebhookDetails.name);
        await webhooks_page.REQUEST_METHOD_DROPDOWN.selectOption(NewWebhookDetails.RequestMethod);
        await webhooks_page.TARGET_INPUT.click();
        await webhooks_page.TARGET_INPUT.fill(NewWebhookDetails.Target);
        await webhooks_page.HEADER_KEY.fill(NewWebhookDetails.HeaderKey);
        await webhooks_page.HEADER_VALUE.fill(NewWebhookDetails.HeaderValue);
        await webhooks_page.ADD_HEADER_BUTTON.click();
        await webhooks_page.SAVE_BUTTON.click();
    });

    await test.step('User should be able to modify the webhook', async () => {
        await webhooks_page.WEBHOOK_TABLE.clickCellWithText(NewWebhookDetails.name);
        await assert(webhooks_page.NAME_INPUT).toHaveValue(NewWebhookDetails.name);
        await assert(webhooks_page.REQUEST_METHOD_DROPDOWN).toHaveValue(NewWebhookDetails.RequestMethod);
        await assert(webhooks_page.TARGET_INPUT).toHaveValue(NewWebhookDetails.Target);
        await webhooks_page.NAME_INPUT.fill(UpdatedWebhookDetails.name);
        await webhooks_page.REQUEST_METHOD_DROPDOWN.selectOption(UpdatedWebhookDetails.RequestMethod);
        await webhooks_page.TARGET_INPUT.fill(UpdatedWebhookDetails.Target);
        await webhooks_page.UPDATE_BUTTON.click();
        await assert(webhooks_page.NAME_INPUT).toHaveValue(UpdatedWebhookDetails.name);
        await assert(webhooks_page.REQUEST_METHOD_DROPDOWN).toHaveValue(UpdatedWebhookDetails.RequestMethod);
        await assert(webhooks_page.TARGET_INPUT).toHaveValue(UpdatedWebhookDetails.Target);
    });

    await test.step('User must be able to delete webhook', async () => {
        await webhooks_page.DELETE_BUTTON.click();
        await webhooks_page.DELETE_KEY_CONFIRMATION_BUTTON.click();
        await assert(webhooks_page.NO_DATA_TO_DISPLAY).toHaveText(emptyWebhookMessage);
    });

});