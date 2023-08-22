const fs = require('fs');

export const newPolicyDefinitionWithDefaults = (policyDetails) => {
    const defaultPolicyDefinition = new Policy_object_designer();
    defaultPolicyDefinition.mergeWithJson(policyDetails);
    return defaultPolicyDefinition.policy_object;
};

export default class Policy_object_designer {
    
    constructor(){
        const json = require('./policy_object');
        this.policy_object = {...json}; //saving values, not link to a file (no caching)
    }

    mergeWithJson(policyDetails) {
        this.mergedPolicyDefinition = {...this.policy_object, ...policyDetails}; 
        this.policy_object = this.mergedPolicyDefinition;
    }

}