const fs = require('fs');

export const newAPIdefinitionWithDefaults = (apiDetails) => {
    const defaultApiDefinition = new API_object_designer();
    defaultApiDefinition.mergeWithJson(apiDetails);
    return defaultApiDefinition.api_object;
};

export default class API_object_designer {
    
    constructor(){
        const json = require('./api_object');
        this.api_object = {...json}; //saving values and not link to a file (no chaching)
    }

    mergeWithJson(apiDetails) {
        this.mergedApiDefinition = {...this.api_object.api_definition, ...apiDetails};
        this.api_object.api_definition = this.mergedApiDefinition;
    }

}