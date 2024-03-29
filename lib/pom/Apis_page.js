var Page = require('./Page');
var Button_object = require('ui_test_automation/wrappers/Button_object');
var Input_object = require('ui_test_automation/wrappers/Input_object');
var DropDown_object = require('ui_test_automation/wrappers/DropDown_object');
var Toggle_object = require('ui_test_automation/wrappers/Toggle_object');
var Accordion_object = require('ui_test_automation/wrappers/Accordion_object');
var Checkbox_object = require('ui_test_automation/wrappers/Checkbox_object');
var OasMapToPolicyTable_object = require('ui_test_automation/wrappers/OasMapToPolicyTable_object');
const path = require('path');

class Apis_page extends Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() { return new Button_object('span*=Add new API'); }
  get API_TABLE() { return $('.tyk-table'); }
  get API_TYPE_GRAPHQL_BUTTON() { return $('label=GraphQL'); }
  get API_TYPE_UDG_BUTTON() { return $('label=UDG'); }
  get API_TYPE_FEDERATION_BUTTON() { return $('label=Federation'); }
  get API_TYPE_SUBGRAPH_BUTTON() { return $('label=Subgraph'); }
  get API_TYPE_SUPERGRAPH_BUTTON() { return $('//input[@name="subType" and @value="supergraph"]'); }

  //LANDING PAGE
  get IMPORT_API_BOX() { return $('h2*=Import API'); }
  get DESIGN_API_BOX() { return new Button_object('h2*=Design new API'); }

  //OAS SIDE MENU
  get SIDE_MENU_BASE_LINK() { return $('//span[text()="Info"]'); }
  get SIDE_MENU_MIDDLEWARE_LINK() { return $('//span[text()="Middleware"]'); }
  get SIDE_MENU_SERVER_LINK() { return $('//span[text()="Server"]'); }
  get SIDE_MENU_UPSTREAM_LINK() { return $('//span[text()="Upstream"]'); }

  //OAS API PAGE
  get API_TYPE_OAS_BUTTON() { return $('span*=OAS HTTP'); }
  get EDIT_BUTTON() { return new Button_object('span*=Edit'); }
  get API_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]'); }
  get OAS_GW_STATUS_DROPDOWN() { return new DropDown_object('//span[@title="Select status"]'); }
  get OAS_ACCESS_DROPDOWN() { return new DropDown_object('//span[@title="Select access"]'); }
  get OAS_API_REST_RADIO() { return new Button_object('//label[text()="REST"]'); }
  get OAS_LISTEN_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.listenPath.value"]'); }
  get OAS_ENABLE_AUTH_TOGGLE() { return new Toggle_object('//label[text()="Enable Authentication"]//following::li[contains(@class, "tyk-toggle__item ")]//input'); }
  get OAS_AUTHENTICATION_DROPDOWN() { return new DropDown_object('//span[@title="Select authentication type"]'); }
  get OAS_CHOSEN_AUTH_TYPES_DROPDOWN() { return new DropDown_object('//div[@name="multi-auth"]//div[@class="tyk-form-control"]'); }
  get OAS_BASE_IDENTITY_PROVIDER_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.baseIdentityProvider"]//div[@class="tyk-form-control"]'); }
  get OAS_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.url"]'); }
  get OAS_NEXT_BUTTON() { return new Button_object('//span[text()="Configure Api"]'); }
  get OAS_SEARCH_ICON() { return new Button_object('//i[contains(@class,"fa-search")]'); }
  get OAS_SEARCH_BAR() { return new Input_object('//input[@name="search"]'); }
  get OAS_SEARCH_BAR_CLOSE_ICON() { return new Button_object('//button[contains(@class, "search-input__close-btn")]'); }
  get OAS_SEARCH_BAR_CLEAR_ICON() { return new Button_object('//input[@name="search"]//following::button[1]'); }
  get OAS_HIDDEN_MATCH_MSG() { return $('//p[contains(@class, "hidden-search-results__message")]'); }
  get OAS_SAVE_BUTTON() { return new Button_object('//button[@type="submit"]'); }
  get OAS_AUTHENTICATION_SAVED() { return $('//label[text()="Authentication"]//following::p[1]'); }
  get OAS_CHOSEN_AUTH_TYPES_SAVED() { return $('//label[text()="Chosen Authentication Types"]//following::div[2]'); }
  get OAS_BASE_IDENTITY_PROVIDER_SAVED() { return $('//label[text()="Base Identity Provider"]//following::div[2]'); }
  get OAS_STRIP_AUTHORIZATION_DATA_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.stripAuthorizationData"]'); }

  //OAS CORS FIELDS
  get OAS_ENABLE_CORS_TOGGLE() { return new Toggle_object('//label[text()="Enable CORS"]//following::li[contains(@class, "tyk-toggle__item ")]//input'); }
  get OAS_OPTIONS_PASS_THROUGH_BOX() { return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.optionsPassthrough"]'); }
  get OAS_ALLOW_CREDENTIALS_BOX() { return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.allowCredentials"]'); }
  get OAS_DEBUG_BOX() { return $('//input[@name="x-tyk-api-gateway.middleware.global.cors.debug"]'); }
  get OAS_MAX_AGE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cors.maxAge"]'); }
  get OAS_ALLOWED_METHODS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedMethods"]//div[@class="tyk-form-control"]'); }
  get OAS_ALLOWED_ORIGINS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedOrigins"]//div[@class="tyk-form-control"]'); }
  get OAS_ALLOWED_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedHeaders"]//div[@class="tyk-form-control"]'); }
  get OAS_EXPOSED_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.exposedHeaders"]//div[@class="tyk-form-control"]'); }
  get OAS_ALLOW_ALL_ORIGINS_BOX() { return $('//label[contains(text(),"Allow All Origins")]//input'); }
  get OAS_ALLOW_ALL_HEADERS_BOX() { return $('//label[contains(text(),"Allow All Headers")]//input'); }
  get OAS_MAX_AGE_SAVED() { return $('//span[text()="Max Age (seconds)"]//following::div[2]'); }
  get OAS_ALLOWED_METHODS_SAVED() { return $('//span[text()="Allowed Methods"]//following::div[2]'); }
  get OAS_ALLOWED_ORIGINS_SAVED() { return $('//span[text()="Allowed Origins"]//following::div[2]'); }
  get OAS_ALLOWED_HEADERS_SAVED() { return $('//span[text()="Allowed Headers"]//following::div[2]'); }
  get OAS_EXPOSED_HEADERS_SAVED() { return $('//span[text()="Exposed Headers"]//following::div[2]'); }

  //OAS CACHE FIELDS
  get OAS_ENABLE_CACHE_TOGGLE() { return new Toggle_object('//label[text()="Enable Caching"]//following::li[contains(@class, "tyk-toggle__item ")]//input'); }
  get OAS_UPSTREAM_CACHE_CONTROL_BOX() { return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.enableUpstreamCacheControl"]'); }
  get OAS_CACHE_TIMEOUT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.timeout"]'); }
  get OAS_CACHE_RESPONSE_CODES_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheResponseCodes"]//div[@class="tyk-form-control"]'); }
  get OAS_CACHE_ALL_SAVE_REQUEST_BOX() { return $('//input[@name="x-tyk-api-gateway.middleware.global.cache.cacheAllSafeRequests"]'); }
  get OAS_ADVANCED_OPTIONS_ACCORDION() { return new Accordion_object('//label[text()="Enable Caching"]//following::button[@class="tyk-accordion__trigger"][1]'); }
  get OAS_CACHE_BY_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheByHeaders"]//div[@class="tyk-form-control"]'); }
  get OAS_CACHE_CONTROL_TTL_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.controlTTLHeaderName"]'); }
  get OAS_CACHE_TIMEOUT_SAVED() { return $('//span[text()="Cache Timeout"]//following::div[2]'); }
  get OAS_CACHE_RESPONSE_CODES_SAVED() { return $('//span[text()="Cache Response Codes"]//following::div[2]'); }
  get OAS_CACHE_BY_HEADERS_SAVED() { return $('//span[text()="Cache by Headers"]//following::div[2]'); }
  get OAS_CACHE_CONTROL_TTL_HEADER_SAVED() { return $('//span[text()="Cache Control TTL Header"]//following::div[2]'); }

  //SERVICE DISCOVERY FIELDS
  get OAS_ENABLE_SD_TOGGLE() { return new Toggle_object('//label[text()="Enable Service Discovery"]//following::li[contains(@class, "tyk-toggle__item ")]//input'); }
  get OAS_SD_PRESETS_DROPDOWN() { return new DropDown_object('//span[text()="Presets"]//following::div[@class="tyk-form-control"][1]'); }
  get OAS_SD_QUERY_ENDPOINT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.queryEndpoint"]'); }
  get OAS_SD_TARGET_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.targetPath"]'); }
  get OAS_SD_ENABLE_CACHE_TIMEOUT_BOX() { return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.enableCacheTimeout"]'); }
  get OAS_SD_CACHE_TIMEOUT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.cacheTimeout"]'); }
  get OAS_SD_RESPONSE_CONFIG_ACCORDTION() { return new Accordion_object('//label[text()="Enable Service Discovery"]//following::button[@class="tyk-accordion__trigger"][1]'); }
  get OAS_SD_ENDPOINT_RETURNS_LIST_BOX() { return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.endpointReturnsList"]'); }
  get OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX() { return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useTargetList"]'); }
  get OAS_SD_PORT_IS_SEPARATE_BOX() { return $('//input[@name="showPortPath"]'); }
  get OAS_SD_PORT_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.portDataPath"]'); }
  get OAS_SD_VALUES_ARE_NESTED_BOX() { return $('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useNestedQuery"]'); }
  get OAS_SD_PARENT_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.parentDataPath"]'); }
  get OAS_SD_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.dataPath"]'); }
  get OAS_SD_QUERY_ENDPOINT_SAVED() { return $('//span[text()="Query Endpoint"]//following::div[2]'); }
  get OAS_SD_TARGET_PATH_SAVED() { return $('//span[text()="Target Path"]//following::div[2]'); }
  get OAS_SD_CACHE_TIMEOUT_SAVED() { return $('(//span[text()="Cache Timeout"]//following::div[2])[1]'); }
  get OAS_SD_PORT_DATA_PATH_SAVED() { return $('//span[text()="Port Data Path"]//following::div[2]'); }
  get OAS_SD_PARENT_DATA_PATH_SAVED() { return $('//span[text()="Parent Data Path"]//following::div[2]'); }
  get OAS_SD_DATA_PATH_SAVED() { return $('//span[text()="Data Path"]//following::div[2]'); }

  //OAS AUTHENTICATION FIELDS

  //AUTH TOKEN
  get OAS_AUTH_TOKEN_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//div[@class="tyk-form-control"][1]'); }
  get OAS_AUTH_TOKEN_USE_HEADER_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.header.enabled"]'); }
  get OAS_AUTH_TOKEN_USE_QUERY_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.query.enabled"]'); }
  get OAS_AUTH_TOKEN_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.cookie.enabled"]'); }
  get OAS_AUTH_TOKEN_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.header.name"]'); }
  get OAS_AUTH_TOKEN_QUERY_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.query.name"]'); }
  get OAS_AUTH_TOKEN_COOKIE_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.cookie.name"]'); }
  get OAS_AUTH_TOKEN_CONFIG_NAME_SAVED() { return $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//div[@class="tyk-form-control--readonly"]'); }
  get OAS_AUTH_TOKEN_HEADER_NAME_SAVED() { return $('//label[text()="Auth Key Header Name"]//following::div[1]'); }
  get OAS_AUTH_TOKEN_QUERY_NAME_SAVED() { return $('//label[text()="Query parameter Name"]//following::div[1]'); }
  get OAS_AUTH_TOKEN_COOKIE_NAME_SAVED() { return $('//label[text()="Cookie Name"]//following::div[1]'); }

  //JWT
  get OAS_JWT_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.name"]//div[@class="tyk-form-control"][1]'); }
  get OAS_JWT_SIGNING_METHOD_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.signingMethod"]//div[@class="tyk-form-control"]'); }
  get OAS_JWT_IDENTITY_SOURCE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.identityBaseField"]'); }
  get OAS_JWT_POLICY_FIELD_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.policyFieldName"]'); }
  get OAS_JWT_USE_HEADER_BOX() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.header.enabled"]'); }
  get OAS_JWT_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.header.name"]'); }

  //BASIC AUTH
  get OAS_BASICAUTH_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.name"]//div[@class="tyk-form-control"][1]'); }
  get OAS_BASICAUTH_ENABLE_CHACHING_BOX() { return $('//label[contains(text(),"Enable Caching")]//input'); }
  get OAS_BASICAUTH_CACHE_TTL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cacheTTL"]'); }
  get OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.enabled"]'); }
  get OAS_BASICAUTH_REGEXP_USERNAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.userRegexp"]'); }
  get OAS_BASICAUTH_REGEXP_PASSWORD_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.passwordRegexp"]'); }
  get OAS_BASICAUTH_USE_HEADER_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.header.enabled"]'); }
  get OAS_BASICAUTH_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.header.name"]'); }
  get OAS_BASICAUTH_STRIP_AUTHDATA_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.stripAuthorizationData"]'); }
  get OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.query.enabled"]'); }
  get OAS_BASICAUTH_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cookie.enabled"]'); }
  get OAS_BASICAUTH_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.query.name"]'); }
  get OAS_BASICAUTH_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cookie.name"]'); }
  get OAS_BASICAUTH_CACHE_TTL_SAVED() { return $('//span[text()="Cache TTL"]//following::div[2]'); }
  get OAS_BASICAUTH_CONFIG_NAME_SAVED() { return $('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.name"]//div[@class="tyk-form-control--readonly"]'); }
  get OAS_BASICAUTH_REGEXP_USERNAME_SAVED() { return $('//span[text()="Regexp to Extract Username"]//following::div[2]'); }
  get OAS_BASICAUTH_REGEXP_PASSWORD_SAVED() { return $('//span[text()="Regexp to Extract Password"]//following::div[2]'); }
  get OAS_BASICAUTH_AUTH_HEADER_SAVED() { return $('//label[text()="Auth Key Header Name"]//following::div[1]'); }
  get OAS_BASICAUTH_QUERY_PARAM_SAVED() { return $('//label[text()="Query parameter Name"]//following::div[1]'); }
  get OAS_BASICAUTH_COOKIE_VALUE_SAVED() { return $('//label[text()="Cookie Name"]//following::div[1]'); }

  //HMAC
  get OAS_HMAC_ALLOWED_ALGORITHMS_DROPDOWN() { return new DropDown_object('//label[text()="Allowed Algorithms"]//following::div[@class="tyk-form-control"][1]'); }
  get OAS_HMAC_ENABLE_CLOCK_SKEW_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.hmac.enableClockSkew"]'); }
  get OAS_HMAC_CLOCK_SKEW_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.allowedClockSkew"]'); }
  get OAS_HMAC_USE_AUTH_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.hmac.header.enabled"]'); }
  get OAS_HMAC_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.header.name"]'); }
  get OAS_HMAC_ALLOW_QUERY_PARAM_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.hmac.query.enabled"]'); }
  get OAS_HMAC_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.hmac.cookie.enabled"]'); }
  get OAS_HMAC_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.query.name"]'); }
  get OAS_HMAC_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.cookie.name"]'); }

  //OAUTH 2.0
  get OAS_OAUTH_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.name"]//div[@class="tyk-form-control"][1]'); }
  get OAS_OAUTH_NOTIFICATIONS_ACCORDTION() { return new Accordion_object('//label[text()="Enable Authentication"]//following::button[@class="tyk-accordion__trigger"][1]'); }
  get OAS_OAUTH_AUTHORIZATION_CODE_BOX() { return $('//input[@name="authorization_code"]'); }
  get OAS_OAUTH_LOGIN_REDIRECT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]'); }
  get OAS_OAUTH_CLIENT_CREDENTIALS_BOX() { return $('//input[@name="client_credentials"]'); }
  get OAS_OAUTH_PASSWORD_BOX() { return $('//input[@name="password"]'); }
  get OAS_OAUTH_REFRESH_TOKEN_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.refreshToken"]'); }
  get OAS_OAUTH_NOTIFICATIONS_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.onKeyChangeUrl"]'); }
  get OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.sharedSecret"]'); }
  get OAS_OAUTH_USE_HEADER_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.header.enabled"]'); }
  get OAS_OAUTH_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.header.name"]'); }
  get OAS_OAUTH_ALLOW_QUERY_PARAM_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.query.enabled"]'); }
  get OAS_OAUTH_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.cookie.enabled"]'); }
  get OAS_OAUTH_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.query.name"]'); }
  get OAS_OAUTH_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.cookie.name"]'); }

  //OpenID Connect
  get OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.segregateByClientId"]'); }
  get OAS_OIDC_ADD_NEW_ISSUER_BUTTON() { return new Button_object('span*=Add New Issuer'); }
  get OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]'); }
  get OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]'); }
  get OAS_OIDC_ADD_CLIENT_ONE_BUTTON() { return new Button_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::span[text()="Add Client"][1]'); }
  get OAS_OIDC_ADD_CLIENT_TWO_BUTTON() { return new Button_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::span[text()="Add Client"][1]'); }
  get OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::ul[1]'); }
  get OAS_OIDC_MAP_CLIENT_TO_POLICY_TWO_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::ul[1]'); }
  get OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX() { return $('//input[@name="enableScopeClaim"]'); }
  get OAS_OIDC_SCOPE_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.scopes.claimName"]'); }
  get OAS_OIDC_ADD_CLAIM_BUTTON() { return new Button_object('span*=Add Claim'); }
  get OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.scopes.claimName"]//following::ul[1]'); }
  get OAS_OIDC_USE_HEADER_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.header.enabled"]'); }
  get OAS_OIDC_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.header.name"]'); }
  get OAS_OIDC_ISSUER_ONE_ACCORDTION() { return new Accordion_object('//h3[text()="Issuer one"]//preceding::button[@class="tyk-accordion__trigger"][1]'); }
  get OAS_OIDC_ISSUER_TWO_ACCORDTION() { return new Accordion_object('//h3[text()="Issuer two"]//preceding::button[@class="tyk-accordion__trigger"][1]'); }
  get OAS_OIDC_ALLOW_QUERY_PARAM_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.query.enabled"]'); }
  get OAS_OIDC_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.oidc.cookie.enabled"]'); }
  get OAS_OIDC_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.query.name"]'); }
  get OAS_OIDC_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.cookie.name"]'); }

  //CUSTOM AUTH PLUGIN
  get OAS_CUSTOM_AUTH_USEHEADER_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.custom.header.enabled"]'); }
  get OAS_CUSTOM_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.header.name"]'); }
  get OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.custom.query.enabled"]'); }
  get OAS_CUSTOM_USE_COOKIE_BOX() { return $('//input[@name="x-tyk-api-gateway.server.authentication.custom.cookie.enabled"]'); }
  get OAS_CUSTOM_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.query.name"]'); }
  get OAS_CUSTOM_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.cookie.name"]'); }
  get OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE() { return new Toggle_object('(//span[text()="Enable Plugin Config"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]'); }
  get OAS_CUSTOM_FUNCTION_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.functionName"]'); }
  get OAS_CUSTOM_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.path"]'); }
  get OAS_CUSTOM_RAW_BODY_TOGGLE() { return new Toggle_object('(//span[text()="Raw Body Only"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]'); }
  get OAS_CUSTOM_REQUIRE_SESSION_TOGGLE() { return new Toggle_object('(//span[text()="Require Session"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]'); }
  get OAS_CUSTOM_IDEXTRACTOR_TOGGLE() { return new Toggle_object('(//span[text()="Enable ID Extractor"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]'); }
  get OAS_CUSTOM_EXTRACT_FROM_DROPDOWN() { return new DropDown_object('//span[text()="Extract From"]//following::div[@class="tyk-form-control"][1]'); }
  get OAS_CUSTOM_EXTRACT_WITH_DROPDOWN() { return new DropDown_object('//span[text()="Extract With"]//following::div[@class="tyk-form-control"][1]'); }
  get OAS_CUSTOM_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.headerName"]'); }
  get OAS_CUSTOM_FORM_PARTAM_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.formParamName"]'); }
  get OAS_CUSTOM_REGEXP_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.regexp"]'); }
  get OAS_CUSTOM_REGEXP_INDEX_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.regexpMatchIndex"]'); }
  get OAS_CUSTOM_XPATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.xPathExp"]'); }


  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() { return new Button_object('span*=Configure Api'); }
  get SAVE_BUTTON() { return new Button_object('.//div[@class="tyk-fixed-wrapper "]//span[normalize-space() = "Save"]'); }
  get OPTIONS_BUTTON() { return new Button_object('span*=OPTIONS'); }
  get DELETE_BUTTON() { return new Button_object('span=Delete'); }
  get UPDATE_BUTTON() { return new Button_object('span=Update'); }

  //MODALS
  get MODAL() { return $('.tyk-modal__content'); }
  get DELETE_API_BUTTON() { return this.MODAL.$('//button//span[text()="Delete API"]'); }
  get UPDATE_API_BUTTON() { return this.MODAL.$('//button//span[text()="Update API"]'); }
  get CONFIRM_BUTTON() { return this.MODAL.$('//button//span[text()="Confirm"]'); }

  //API MESSAGE POPUPS
  get API_UPDATED_MESSAGE() { return $('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully updated"]'); }
  get API_DELETED_MESSAGE() { return $('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully deleted"]'); }

  get api_created_expected_mesage() { return 'API successfully created'; }
  isApiCreatedPopUpDisplayed() { return this.isSuccessPopupDisplayedWithText(this.api_created_expected_mesage); }

  get api_updated_expected_mesage() { return 'API successfuly updated'; }
  isApiUpdatedPopUpDisplayed() { return this.isSuccessPopupDisplayedWithText(this.api_updated_expected_mesage); }

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }

}
export const apis_page = new Apis_page();