var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Toggle_object = require('ui_test_automation/wrappers/Toggle_object');
var Accordion_object = require('ui_test_automation/wrappers/Accordion_object');

class Apis_page extends Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() {return new Button_object('span*=Add new API');}
  get API_TABLE() {return $('.tyk-table');}
  
  //LANDING PAGE
  get IMPORT_API_BOX() {return $('h2*=Import API');}
  get DESIGN_API_BOX() {return new Button_object('h2*=Design new API');}
  get TRY_DEMO_BOX() {return $('h2*=Try demo API');}

  //OAS SIDE MENU
  get SIDE_MENU_BASE_LINK() {return $('//span[text()="Info"]');}
  get SIDE_MENU_MIDDLEWARE_LINK() {return $('//span[text()="Middleware"]');}
  get SIDE_MENU_SERVER_LINK() {return $('//span[text()="Server"]');}

  //OAS API PAGE
  get EDIT_BUTTON() {return new Button_object('span*=Edit');}
  get API_NAME_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]');}
  get OAS_ADD_API_BUTTON() {return new Button_object('span*=Add Api');}
  get OAS_GW_STATUS_DROPDOWN() {return new DropDown_object('//span[@title="Select status"]');}
  get OAS_ACCESS_DROPDOWN() {return new DropDown_object('//span[@title="Select access"]');}
  get OAS_API_REST_RADIO() {return new Button_object('//label[text()="REST"]');}
  get OAS_LISTEN_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.listenPath.value"]');}
  get OAS_ENABLE_AUTH_TOGGLE() {return new Toggle_object('//label[text()="Enable Authentication"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_AUTHENTICATION_DROPDOWN() {return new DropDown_object('//span[@title="Select authentication type"]');}
  get OAS_CHOSEN_AUTH_TYPES_DROPDOWN() {return new DropDown_object('//div[@name="multi-auth"]//div[@class="tyk-form-control"]');}
  get OAS_BASE_IDENTITY_PROVIDER_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.baseIdentityProvider"]//div[@class="tyk-form-control"]');}
  get OAS_AUTH_KEY_HEADER_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.token.header.name"]');}
  get OAS_TARGET_URL_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.url"]');}
  get OAS_NEXT_BUTTON() {return new Button_object('//span[text()="Configure Api"]');}
  get OAS_SEARCH_ICON() {return new Button_object('//i[contains(@class,"fa-search")]');}
  get OAS_SEARCH_BAR() {return new Input_object('//input[@name="search"]');}
  get OAS_SEARCH_BAR_CLOSE_ICON() {return new Button_object('//button[contains(@class, "search-input__close-btn")]');}
  get OAS_SEARCH_BAR_CLEAR_ICON() {return new Button_object('//input[@name="search"]//following::button[1]');}
  get OAS_HIDDEN_MATCH_MSG() {return $('//p[contains(@class, "hidden-search-results__message")]');}
  get OAS_SAVE_BUTTON() {return new Button_object('//button[@type="submit"]');}
  get OAS_AUTHENTICATION_SAVED() {return $('//label[text()="Authentication"]//following::p[1]');}
  get OAS_CHOSEN_AUTH_TYPES_SAVED() {return $('//label[text()="Chosen Authentication Types"]//following::div[2]');}
  get OAS_BASE_IDENTITY_PROVIDER_SAVED() {return $('//label[text()="Base Identity Provider"]//following::div[2]');}

  //OAS CORS FIELDS
  get OAS_ENABLE_CORS_TOGGLE() {return new Toggle_object('//label[text()="Enable CORS"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_OPTIONS_PASS_THROUGH_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.optionsPassthrough"]');}
  get OAS_ALLOW_CREDENTIALS_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.allowCredentials"]');}
  get OAS_DEBUG_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.debug"]');}
  get OAS_MAX_AGE_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cors.maxAge"]');}
  get OAS_ALLOWED_METHODS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedMethods"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOWED_ORIGINS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedOrigins"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOWED_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_EXPOSED_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.exposedHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_ALLOW_ALL_ORIGINS_BOX() {return $('//label[contains(text(),"Allow All Origins")]//input');}
  get OAS_ALLOW_ALL_HEADERS_BOX() {return $('//label[contains(text(),"Allow All Headers")]//input');}
  get OAS_MAX_AGE_SAVED() {return $('//span[text()="Max Age (seconds)"]//following::div[2]');}
  get OAS_ALLOWED_METHODS_SAVED() {return $('//span[text()="Allowed Methods"]//following::div[2]');}
  get OAS_ALLOWED_ORIGINS_SAVED() {return $('//span[text()="Allowed Origins"]//following::div[2]');}
  get OAS_ALLOWED_HEADERS_SAVED() {return $('//span[text()="Allowed Headers"]//following::div[2]');}
  get OAS_EXPOSED_HEADERS_SAVED() {return $('//span[text()="Exposed Headers"]//following::div[2]');}

  //OAS CACHE FIELDS
  get OAS_ENABLE_CACHE_TOGGLE() {return new Toggle_object('//label[text()="Enable Caching"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_UPSTREAM_CACHE_CONTROL_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.enableUpstreamCacheControl"]');}
  get OAS_CACHE_TIMEOUT_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.timeout"]');}
  get OAS_CACHE_RESPONSE_CODES_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheResponseCodes"]//div[@class="tyk-form-control"]');}
  get OAS_CACHE_ALL_SAVE_REQUEST_BOX() {return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.cacheAllSafeRequests"]');}
  get OAS_ADVANCED_OPTIONS_ACCORDION() {return new Accordion_object('//label[text()="Enable Caching"]//following::button[@class="tyk-accordion__trigger"][1]');}
  get OAS_CACHE_BY_HEADERS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheByHeaders"]//div[@class="tyk-form-control"]');}
  get OAS_CACHE_CONTROL_TTL_HEADER_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.controlTTLHeaderName"]');}
  get OAS_CACHE_TIMEOUT_SAVED() {return $('//span[text()="Cache Timeout"]//following::div[2]');}
  get OAS_CACHE_RESPONSE_CODES_SAVED() {return $('//span[text()="Cache Response Codes"]//following::div[2]');}
  get OAS_CACHE_BY_HEADERS_SAVED() {return $('//span[text()="Cache by Headers"]//following::div[2]');}
  get OAS_CACHE_CONTROL_TTL_HEADER_SAVED() {return $('//span[text()="Cache Control TTL Header"]//following::div[2]');}

  //SERVICE DISCOVERY FIELDS
  get OAS_ENABLE_SD_TOGGLE() {return new Toggle_object('//label[text()="Enable Service Discovery"]//following::li[contains(@class, "tyk-toggle__item ")]//input');}
  get OAS_SD_PRESETS_DROPDOWN() {return new DropDown_object('//span[text()="Presets"]//following::div[@class="tyk-form-control"][1]');}
  get OAS_SD_QUERY_ENDPOINT_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.queryEndpoint"]');}
  get OAS_SD_TARGET_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.targetPath"]');}
  get OAS_SD_ENABLE_CACHE_TIMEOUT_BOX() {return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.enableCacheTimeout"]');}
  get OAS_SD_CACHE_TIMEOUT_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.cacheTimeout"]');}
  get OAS_SD_RESPONSE_CONFIG_ACCORDTION() {return new Accordion_object('//label[text()="Enable Service Discovery"]//following::button[@class="tyk-accordion__trigger"][1]');}
  get OAS_SD_ENDPOINT_RETURNS_LIST_BOX() {return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.endpointReturnsList"]');}
  get OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX() {return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useTargetList"]');}
  get OAS_SD_PORT_IS_SEPARATE_BOX() {return $('//input[@name="showPortPath"]');}
  get OAS_SD_PORT_DATA_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.portDataPath"]');}
  get OAS_SD_VALUES_ARE_NESTED_BOX() {return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useNestedQuery"]');}
  get OAS_SD_PARENT_DATA_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.parentDataPath"]');}
  get OAS_SD_DATA_PATH_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.dataPath"]');}
  get OAS_SD_QUERY_ENDPOINT_SAVED() {return $('//span[text()="Query Endpoint"]//following::div[2]');}
  get OAS_SD_TARGET_PATH_SAVED() {return $('//span[text()="Target Path"]//following::div[2]');}
  get OAS_SD_CACHE_TIMEOUT_SAVED() {return $('(//span[text()="Cache Timeout"]//following::div[2])[1]');}
  get OAS_SD_PORT_DATA_PATH_SAVED() {return $('//span[text()="Port Data Path"]//following::div[2]');}
  get OAS_SD_PARENT_DATA_PATH_SAVED() {return $('//span[text()="Parent Data Path"]//following::div[2]');}
  get OAS_SD_DATA_PATH_SAVED() {return $('//span[text()="Data Path"]//following::div[2]');}
  
  //OAS AUTHENTICATION FIELDS
  //AUTH TOKEN
  get OAS_AUTH_TOKEN_HEADER_NAME_INPUT() {return Input_object('//input[@name="x-tyk-api-gateway.server.authentication.token.header.name"]');}
  
  //JWT
  get OAS_JWT_SIGNING_METHOD_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.jwt.signingMethod"]//div[@class="tyk-form-control"]');}
  get OAS_JWT_IDENTITY_SOURCE_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.jwt.identityBaseField"]');}
  get OAS_JWT_POLICY_FIELD_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.jwt.policyFieldName"]');}
  get OAS_JWT_HEADER_NAME_INPUT() {return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.jwt.header.name"]');}

  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() {return new Button_object('span*=Configure Api');}
  get SAVE_BUTTON() {return new Button_object('.//div[@class="tyk-fixed-wrapper "]//span[normalize-space() = "Save"]');}
  get OPTIONS_BUTTON() {return new Button_object('span*=OPTIONS');}
  get DELETE_BUTTON() {return new Button_object('span=Delete');}
  get UPDATE_BUTTON() {return new Button_object('span=Update');}

  //MODALS
  get MODAL() {return $('.tyk-modal__content');}
  get DELETE_API_BUTTON() {return this.MODAL.$('//button//span[text()="Delete API"]');}
  get UPDATE_API_BUTTON() {return this.MODAL.$('//button//span[text()="Update API"]');}
  get CONFIRM_BUTTON() {return this.MODAL.$('//button//span[text()="Confirm"]');}

  //GRAPHQL ITEMS
  get GRAPHQL_SCHEMA_TAB_BUTTON() {return new Button_object('button=Schema');}
  get PROXY_ONLY_GET_LATEST_VERSION_BUTTON() {return new Button_object('//u[text()="Get latest version "]');}
  get GRAPHQL_ENABLE_PLAYGROUND_TOGGLE() {return new Toggle_object('span=Enable Playground');}
  get API_TYPE_GRAPHQL_BUTTON() {return $('label=GraphQL');}
  get API_TYPE_UDG_BUTTON() {return $('label=UDG');}
  get API_TYPE_FEDERATION_BUTTON() {return $('label=Federation');}
  get API_TYPE_SUBGRAPH_BUTTON() {return $('label=Subgraph');}
  get API_TYPE_SUPERGRAPH_BUTTON() {return $('//input[@name="subType" and @value="supergraph"]');}
  get GRAPHQL_SUBGRAPHS_DROPDOWN() {return new DropDown_object('//div[@name="x-tyk-api-gateway.server.graphql.superGraph.subgraphs"]//div[@class="tyk-form-control"]')}
  get UDG_EDITOR_MODE_BUTTON() {return new Button_object('span=Editor');}
  get UDG_DATA_SOURCES_MODE_BUTTON() {return new Button_object('span=Data Sources');}
  get UDG_ADD_OBJECT_BUTTON() {return new Button_object('span=Object');}
  get UDG_OBJECT_TYPE_DROPDOWN() {return new DropDown_object('//div[@name="kind"]//div[@class="tyk-form-control"]');}
  get UDG_OBJECT_NAME_INPUT() {return new Input_object('//input[@name="name" and @class="tyk-form-control" and @label="Name"]');}
  get UDG_CREATE_UPDATE_OBJECT_BUTTON() {return new Button_object('//button[@type="submit"]//span[text()=" Object"]');}  
  get UDG_CREATE_UPDATE_FIELD_AND_DATA_SOURCE_BUTTON() {return new Button_object('//button[@type="submit"]//span[text()=" Field and Data Source"]');}
  getUDG_FIELD_OBJECT_BUTTON(object,field) {
    return new Button_object(`//span[text()="${object}"]//following::div[@class="collapse-wrapper"]//descendant::span[text()="${field}"]`);}
  getUDG_EDIT_OBJECT_BUTTON(object){
    return new Button_object(`//span[text()="${object}"]//following::div[@class="right-align-controls"]//button//i`);}   
  get UDG_DEFINE_DATASOURCES_BUTTON() {return new Button_object('span=Define data sources');}
  get UDG_DATA_SOURCE_TAB_BUTTON() {return new Button_object('span=Data source');}
  get UDG_DATA_MODEL_TAB_BUTTON() {return new Button_object('span=Data model');}
  get UDG_DATA_SOURCE_EXISTING_DATA_SOURCE_DROPDOWN() {return new DropDown_object('//div[@class="well"]//div[@class="tyk-form-control"]');}
  get UDG_DATA_SOURCE_TYPE_DROPDOWN() {return new DropDown_object('//div[@name="data_source.kind"]//div[@class="tyk-form-control"]');}
  get UDG_DATA_SOURCE_URL_INPUT() {return new Input_object('//textarea[@name="data_source.config.url"]');}
  get UDG_DATA_SOURCE_TYK_APIS_DROPDOWN() {return new DropDown_object('//div[@name="api"]//div[@class="tyk-form-control"]');}
  get UDG_DATA_SOURCE_ENDPOINT() {return new DropDown_object('//div[@name="endpoint"]//div[@class="tyk-form-control"]');}
  get UDG_TEMPLATING_SYNTAX_HINT() {return new DropDown_object('//ul[@class="string-builder-list"]');}
  get UDG_DATA_SOURCE_NAME_INPUT() {return new Input_object('//input[@name="data_source.name"]');}
  get UDG_DATA_SOURCE_METHOD() {return new DropDown_object('//div[@name="data_source.config.method"]//div[@class="tyk-form-control"]');}
  get UDG_HEADERS_KEY_INPUT() {return new Input_object('//input[@name="key"]');}
  get UDG_HEADERS_VALUE_INPUT() {return new Input_object('//input[@name="value"]');}
  get UDG_DATA_MODEL_FIELD_TYPE_DROPDOWN() {return new DropDown_object('//div[@name="schema.fieldType"]//div[@class="tyk-form-control"]');}
  get UDG_DATA_MODEL_FIELD_TYPE_VALUE_DROPDOWN() {return new DropDown_object('//div[@name="schema.fieldTypeValue"]//div[@class="tyk-form-control"]');}
  get UDG_DATA_MODEL_NAME_INPUT() {return new Input_object('//input[@name="schema.name"]');}
  get UDG_DELETE_FIELD_BUTTON() {return new Button_object('//span[text()="Delete field"]');}
  get UDG_DELETE_OBJECT_BUTTON() {return new Button_object('//span[text()="Delete Object"]');}
  get UDG_FILTER_BY_NAME_INPUT() {return new Input_object('//input[@name="name" and @label="Filter by name"]');}
  get UDG_FILTER_BY_TYPE_INPUT() {return new DropDown_object('//div[@name="type"]//div[@class="tyk-form-control"]');}

  //API MESSAGE POPUPS
  get API_UPDATED_MESSAGE() {return $('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully updated"]');}
  get API_DELETED_MESSAGE() {return $('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully deleted"]');}

  get api_created_expected_mesage() {return 'API successfuly created';}
  isApiCreatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.api_created_expected_mesage);}

  get api_updated_expected_mesage() {return 'API successfuly updated';}
  isApiUpdatedPopUpDisplayed() {return this.isSuccessPopupDisplayedWithText(this.api_updated_expected_mesage);}

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }

}
export const apis_page = new Apis_page();