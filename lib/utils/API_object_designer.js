export const newAPIdefinitionWithDefaults = (apiDetails) => {
    const defaultApiDefinition = new API_object_designer();
    defaultApiDefinition.mergeWithJson(apiDetails);
    return defaultApiDefinition.api_object;
};

export default class API_object_designer {
    
    constructor(){
        this.api_object = require('./api_object.json');
    }

    mergeWithJson(apiDetails) {
        this.definition = {...this.api_object.api_definition, ...apiDetails};
        this.api_object.api_definition = this.definition;
    }

}