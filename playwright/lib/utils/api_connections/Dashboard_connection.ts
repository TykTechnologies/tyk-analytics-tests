import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { config } from '@variables';
import { assert } from '@fixtures';
import fs from 'fs';

enum RequestTypes {
    GET,
    POST,
    PUT,
    DELETE
}
export class Dashboard_connection {
  dashAPI = config.DASHBOARD_API;
  // getUserWithEmail(userEmail: string, secret: string) {
  //     console.debug(`>>> Getting user with email ${userEmail}`);
  //     const response = this.sendGetRequest({path: config.USERS_API_PATH, Authorization: secret});
  //     const usersList = response.body.users;
  //     console.debug(usersList);
  //     return usersList.filter((user) => user.email_address === userEmail);
  // }

  async createAPI(apiDefinition: any, userSecret: string): Promise<string> {
    console.log(`>>> Creating API with name: ${apiDefinition.api_definition.name}`);
    const path = this.dashAPI + "apis/";
    const headers = { Authorization: userSecret };
    const context: APIRequestContext = await request.newContext({});
    const response: APIResponse = await context.post(path, { data: apiDefinition, headers: headers });
    assert(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    assert(responseBody.Meta !== undefined);
    console.debug(`>>> New organization was created: ${responseBody}`);
    return responseBody.Meta; 
  }

  async getAPI(meta: string, userSecret: string): Promise<string> {
    console.log(`>>> Get API for meta: ${meta}`);
    const path = this.dashAPI + "apis/" + meta;
    const headers = { Authorization: userSecret };
    const context: APIRequestContext = await request.newContext({});
    const response: APIResponse = await context.get(path, { headers: headers });
    assert(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    console.log(`>>> API received. API definition: ${responseBody}`);
    return responseBody.api_definition.api_id;
  }

  async sendRequest(endpoint: string, type: RequestTypes, userSecret: string, body?: any): Promise<APIResponse> {
    const context: APIRequestContext = await request.newContext({});
    const path = this.dashAPI + endpoint;
    const headers = { Authorization: userSecret };
    let response: APIResponse;
    switch (type) {
    case RequestTypes.GET:
      response = await context.get(path, { headers: headers });
    case RequestTypes.POST:
      response = await context.post(path, { data: body, headers: headers });
    case RequestTypes.PUT:
      response = await context.put(path, { data: body, headers: headers });
    case RequestTypes.DELETE:
      response = await context.delete(path, { headers: headers });
    default:
      response = await context.get(path, { headers: headers });
    }
    assert(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    console.log(`>>> Response received. Body: ${responseBody}`);
    return responseBody;
  }

  async createPolicy(policyDefinition: any, userSecret: string): Promise<void> {
    console.log(`>>> Creating Policy with name: ${policyDefinition.name}`);
    const responseBody: any = await this.sendRequest("portal/policies/", RequestTypes.POST, userSecret, policyDefinition);
    console.log(`>>> Policy created. Policy definition id: ${responseBody.Meta}`);
  }

  async getPolicyByName(name: string, userSecret: string): Promise<APIResponse> {
    console.log(`>>> Get Policy by name: ${name}`);
    const responseBody: APIResponse = await this.sendRequest("portal/policies/search/?q=" + name, RequestTypes.GET, userSecret);
    console.log(`>>> Policy received. Policy definition: ${responseBody}`);
    return responseBody;
  }

  async uploadCert(certFileLocation: any, userSecret: string) {
    console.log('>>> Uploading Certificate');
    const certFile = fs.createReadStream(certFileLocation);
    const context: APIRequestContext = await request.newContext({});
    const path = config.DASHBOARD_API + "certs/";
    const headers = { Authorization: userSecret /*'ContentType':'multipart/form-data'*/ };
    const response: APIResponse = await context.post(path, { 
      headers: headers,
      multipart: {
        fileField: certFile
        // file: {
        //     name: 'certFile',
        //     buffer: certFile,
        //     mimeType: 'application/x-pem-file'
        // }
      }
    });
    // const config2 = {
    //     path: "certs/",
    //     file: certFile,
    //     headers: { Authorization: userSecret }
    // };
    // const response = this.sendPostRequest(config);
    const responseBody = await response.json();
    assert(response.ok()).toBeTruthy();
    // const responseBody = await response.json();
    console.log(`>>> Certificate added. Cert id: ${responseBody.id}`);
  }
}
