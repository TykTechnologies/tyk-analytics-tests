import { login_page } from '../../../lib/pom/Login_page';
import { apis_page } from '../../../lib/pom/Apis_page';
import { endpoints_page } from '../../../lib/pom/Endpoints_page';
import { main_page } from '../../../lib/pom/Main_page';
import { expect } from 'chai';

xdescribe('Test Endpoints list on OAS API designer page', () => {
  let envDetails;
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

  before(() => {
    envDetails = setUpEnv();
    login_page.open();
    login_page.login(envDetails.userEmail, envDetails.userPassword);
  });

  it('Initially Endpoint list is empty', () => {
    main_page.openAPIs();
    apis_page.DESIGN_API_BOX.click();
    apis_page.API_TYPE_OAS_BUTTON.click();
    apis_page.API_NAME_INPUT.setValue('endpoint-test');
    apis_page.OAS_NEXT_BUTTON.click();
    apis_page.OAS_GW_STATUS_DROPDOWN.selectOption("Active");
    apis_page.OAS_ACCESS_DROPDOWN.selectOption("External");
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    wdioExpect(endpoints_page.OAS_NO_ENDPOINTS_MESSAGE).toBeDisplayed();
  });

  it('User can add endpoints and save API', () => {
    createdEndpointsList.forEach (e => {
      endpoints_page.addNewEndpoint(e.endpoint, e.method);
    });
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiCreatedPopUpDisplayed()).to.be.true; 
  });

  
  it('All Endpoints are displayed after page relaod', () => {
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    createdEndpointsList.forEach (e => {
      verifyDisplayedEndpoints(e, createdEndpointsList);
    });
  });

  it('User can filter endpoints by name', () => {
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

  it('User can filter endpoints by method', () => {
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

  it('User can filter endpoints by endpoint name and method', () => {
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

  xit('User can modify endpoints and save API', () => {
    browser.refresh();
    let oldEendpointSelector = $('//a[contains(@href, "-ipget")]');
    let newEendpointSelector = $('//a[contains(@href, "-headershead")]');
    apis_page.EDIT_BUTTON.click();
    endpoints_page.modifyEndpoint("/ip", "GET", "/headers", "HEAD");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true; 
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    wdioExpect(oldEendpointSelector).not.toBeDisplayed();
    wdioExpect(newEendpointSelector).toBeDisplayed();
  });

  it('User can remove endpoints and save API', () => {
    browser.refresh();
    let removeEendpointSelector = $('//a[contains(@href, "-ippost")]');
    apis_page.EDIT_BUTTON.click();
    endpoints_page.removeEndpoint("/ip", "POST");
    apis_page.OAS_SAVE_BUTTON.click();
    expect(apis_page.isApiUpdatedPopUpDisplayed()).to.be.true; 
    browser.refresh();
    endpoints_page.OAS_ENDPOINTS_BUTTON.click();
    wdioExpect(removeEendpointSelector).not.toBeDisplayed();
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
    let endpointSelector = $(`//a[contains(@href, "${endpointUrlLink}")]`);
    if (JSON.stringify(expectedEndpoints).includes(JSON.stringify(endpointObject))){
      wdioExpect(endpointSelector).toBeDisplayed();
    } 
    else {
      wdioExpect(endpointSelector).not.toBeDisplayed();
    }
  }

});
