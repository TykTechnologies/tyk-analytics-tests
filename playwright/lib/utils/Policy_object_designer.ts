export const newPolicyDefinitionWithDefaults = (policyDetails: JSON) => {
  const defaultPolicyDefinition = new Policy_object_designer();
  defaultPolicyDefinition.mergeWithJson(policyDetails);
  return defaultPolicyDefinition.policy_object;
};

export default class Policy_object_designer {
  policy_object: any;
  mergedPolicyDefinition: any;
    
  constructor() {
    const json = require('./policy_object.json');
    this.policy_object = { ...json }; //saving values, not link to a file (no caching)
  }

  mergeWithJson(policyDetails: JSON) {
    this.mergedPolicyDefinition = { ...this.policy_object, ...policyDetails }; 
    this.policy_object = this.mergedPolicyDefinition;
  }

}