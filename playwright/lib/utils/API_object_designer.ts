import fs from 'fs';
import json from './api_object';

export const newAPIdefinitionWithDefaults = (apiDetails) => {
    const defaultApiDefinition = new API_object_designer();
    defaultApiDefinition.mergeWithJson(apiDetails);
    return defaultApiDefinition.api_object;
};

export default class API_object_designer {
    
    constructor(){
        this.api_object = {...json}; //saving values, not link to a file (no caching)
    }

    mergeWithJson(apiDetails) {
        this.mergedApiDefinition = {...this.api_object.api_definition, ...apiDetails};
        this.api_object.api_definition = this.mergedApiDefinition;
    }

}