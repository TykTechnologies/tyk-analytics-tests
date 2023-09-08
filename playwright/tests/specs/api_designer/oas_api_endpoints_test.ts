import { test, assert } from '@fixtures';
import { apis_page } from '../../../lib/pom/Apis_page';
import { endpoints_page } from '../../../lib/pom/Endpoints_page';

import { expect } from 'chai';

test('Test Endpoints list on OAS API designer page', async ({ createUserAndLogin, main_page }) => {
  
  const createdEndpointsList = [
    {
      endpoint: '/ip',
      method: 'GET'
    },
    {
      endpoint: '/ips',
      method: 'GET'
    },
    {
      endpoint: '/ip',
      method: 'POST'
    },
    {
      endpoint: '/headers',
      method: 'GET'
    },
    {
      endpoint: '/headers',
      method: 'POST'
    },
    {
      endpoint: '/headers',
      method: 'DELETE'
    },
    {
      endpoint: '/tyk/keys/{keyID}',
      method: 'HEAD'
    }
  ];

  
  await test.step('Initially Endpoint list is empty', async () => {
    await main_page.openAPIs();
   await apis_page.DESIGN_API_BOX.click();
   await apis_page.API_TYPE_OAS_BUTTON.click();
   await apis_page.API_NAME_INPUT.fill('endpoint-test');
   await apis_page.OAS_NEXT_BUTTON.click();
   await apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
   await apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    await assert(endpoints_page.OAS_NO_ENDPOINTS_MESSAGE).toBeVisible();
  });

  await test.step('User can add endpoints and save API', async () => {
    createdEndpointsList.forEach (e => {
      endpoints_page.addNewEndpoint(e.endpoint, e.method);
    });
   await apis_page.OAS_SAVE_BUTTON.click();
    await apis_page.isApiCreatedPopUpDisplayed(); 
  });

  
  await test.step('All Endpoints are displayed after page relaod', async () => {
    await page.reload();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    createdEndpointsList.forEach (e => {
      verifyDisplayedEndpoints(e, createdEndpointsList);
    });
  });

  await test.step('User can filter endpoints by name', async () => {
    const searchCriteria = 'ip';
    const expectedEndpointList = [
      {
        endpoint: '/ip',
        method: 'GET'
      },
      {
        endpoint: '/ips',
        method: 'GET'
      },
      {
        endpoint: '/ip',
        method: 'POST'
      }
    ];
    endpoints_page.searchEndpointsByName(searchCriteria);
    createdEndpointsList.forEach (e => {
      verifyDisplayedEndpoints(e, expectedEndpointList);
    });
  });

  await test.step('User can filter endpoints by method', async () => {
    const methodFilter = 'GET';
    const expectedEndpointList = [
      {
        endpoint: '/ip',
        method: 'GET'
      },
      {
        endpoint: '/ips',
        method: 'GET'
      },
      {
        endpoint: '/headers',
        method: 'GET'
      }
    ];
    endpoints_page.clearSerachCriteria();
    endpoints_page.filterEndpointsByMethod(methodFilter);
    createdEndpointsList.forEach (e => {
      verifyDisplayedEndpoints(e, expectedEndpointList);
    });
  });

  await test.step('User can filter endpoints by endpoint name and method', async () => {
    const methodFilter = 'POST';
    const searchCriteria = 'header';
    const expectedEndpointList = [
      {
        endpoint: '/headers',
        method: 'POST'
      }
    ];
    endpoints_page.searchEndpointsByName(searchCriteria);
    endpoints_page.filterEndpointsByMethod(methodFilter);
    createdEndpointsList.forEach (e => {
      verifyDisplayedEndpoints(e, expectedEndpointList);
    });
  });

  await test.step('User can modify endpoints and save API', async () => {
    await page.reload();
    let oldEendpointSelector = await this.page.locator('//a[contains(@href, "-ipget")]');
    let newEendpointSelector = await this.page.locator('//a[contains(@href, "-headershead")]');
   await apis_page.EDIT_BUTTON.click();
    endpoints_page.modifyEndpoint("/ip", "GET", "/headers", "HEAD");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy(); 
    await page.reload();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    await assert(oldEendpointSelector).not.toBeVisible();
    await assert(newEendpointSelector).toBeVisible();
  });

  await test.step('User can remove endpoints and save API', async () => {
    await page.reload();
    let removeEendpointSelector = await this.page.locator('//a[contains(@href, "-ippost")]');
   await apis_page.EDIT_BUTTON.click();
    endpoints_page.removeEndpoint("/ip", "POST");
   await apis_page.OAS_SAVE_BUTTON.click();
    assert(apis_page.isApiUpdatedPopUpDisplayed()).toBeTruthy(); 
    await page.reload();
   await endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    await assert(removeEendpointSelector).not.toBeVisible();
  });

/**
 * Verify if endpoint is displayed or not.
 * Function checks if tested endpoint is included in array of expected endpoints.
 * @param {Object} endpointObject Represents endpoint to test
 * @param {Array} expectedEndpoints Array of expected endpoints to be displayed
 * @function
 */
  function verifyDisplayedEndpoints(endpointObject, expectedEndpoints) {
    let endpointUrlLink = encodeURIComponent(endpointObject.endpoint.split('/').join('-')) + endpointObject.method.toLowerCase();
    let endpointSelector = await this.page.locator(`//a[contains(@href, "${endpointUrlLink}")]`);
    if (JSON.stringify(expectedEndpoints).includes(JSON.stringify(endpointObject))){
      await assert(endpointSelector).toBeVisible();
    } 
    else {
      await assert(endpointSelector).not.toBeVisible();
    }
  }

});
