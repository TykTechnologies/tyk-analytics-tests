import { config } from '@variables';
import { APIRequestContext, request, APIResponse } from '@playwright/test';
import { assert } from '@fixtures';

export class Dashboard_admin_connection {
    url: string;    
    org_prefix: string;
    
    constructor(){
        this.url = config.DASHBOARD_ADMIN_API;
        this.org_prefix = config.ORG_API_PATH;
    }

    async createOrg(body: {
            cname: string; cname_enabled: boolean; owner_name: string; owner_slug: string;
        }, headers: { "admin-auth": string; }) {
        const context: APIRequestContext = await request.newContext({});
        const response: APIResponse = await context.post(this.url + this.org_prefix, {data: body, headers: headers});
        assert(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        assert(responseBody.Meta !== undefined);
        console.debug(`>>> New organization was created: ${responseBody}`);
        return responseBody.Meta; 
    }

    async getStatus(headers: { "admin-auth": any; }): Promise<APIResponse> {
        console.log(">>> Checking is dashboard is up");
        const context: APIRequestContext = await request.newContext({});
        const response: APIResponse = await context.get(this.url + config.HELLO_PATH, {headers: headers});
        return response;
    }
}
