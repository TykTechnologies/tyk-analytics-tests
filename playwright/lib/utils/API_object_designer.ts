import json from './api_object.json';

export const newAPIdefinitionWithDefaults = (apiDetails: Record<string, any>) => {
  const defaultApiDefinition = new API_object_designer();
  defaultApiDefinition.mergeWithJson(apiDetails);
  return defaultApiDefinition.api_object;
};

export default class API_object_designer {
  api_object: any;
    
  constructor() {
    this.api_object = { ...json }; //saving values, not link to a file (no caching)
  }

  mergeWithJson(apiDetails: any) {
    this.api_object.api_definition = { ...this.api_object.api_definition, ...apiDetails };
  }

}