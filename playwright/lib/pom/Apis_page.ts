import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { SlowButton_object } from '@wrappers/SlowButton_object';
import { Input_object } from '@wrappers/Input_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Checkbox_object } from '@wrappers/CheckBox_object';
import { Toggle_object } from'@wrappers/Toggle_object';
import { Accordion_object } from '@wrappers/Accordion_object';
import { OasMapToPolicyTable_object } from '@wrappers/OasMapToPolicyTable_object';

export class Apis_page extends Template_Page {
  //MAIN PAGE
  get ADD_NEW_API_BUTTON() { return new Button_object('span:text-is("Add new API")', this.page); }
  get API_TABLE() { return this.page.locator('.tyk-table'); }
  get API_TYPE_GRAPHQL_BUTTON() { return this.page.getByLabel('GraphQL'); }
  get API_TYPE_UDG_BUTTON() { return this.page.getByLabel('UDG'); }
  get API_TYPE_FEDERATION_BUTTON() { return this.page.getByLabel('Federation'); }
  get API_TYPE_SUBGRAPH_BUTTON() { return this.page.getByLabel('Subgraph').first(); }
  get API_TYPE_SUPERGRAPH_BUTTON() { return this.page.locator('//input[@name="subType" and @value="supergraph"]'); }

  //LANDING PAGE
  get IMPORT_API_BOX() { return this.page.locator('h2:text-is("Import API")'); }
  get DESIGN_API_BOX() { return new Button_object('h2:text-is("Design new API")', this.page); }

  //OAS SIDE MENU
  get SIDE_MENU_BASE_LINK() { return this.page.locator('//span[text()="Info"]'); }
  get SIDE_MENU_MIDDLEWARE_LINK() { return this.page.locator('//span[text()="Middleware"]'); }
  get SIDE_MENU_SERVER_LINK() { return this.page.locator('//span[text()="Server"]'); }
  get SIDE_MENU_UPSTREAM_LINK() { return this.page.locator('//span[text()="Upstream"]'); }

  //OAS API PAGE
  get API_TYPE_OAS_BUTTON() { return this.page.getByLabel('OAS HTTPEarly Access'); }
  get EDIT_BUTTON() { return new Button_object('span:text-is("Edit")', this.page); }
  get API_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.info.name"]', this.page); }
  get OAS_GW_STATUS_DROPDOWN() { return new DropDown_object('//span[@title="Select status"]', this.page); }
  get OAS_ACCESS_DROPDOWN() { return new DropDown_object('//span[@title="Select access"]', this.page); }
  get OAS_API_REST_RADIO() { return new Button_object('//label[text()="REST"]', this.page); }
  get OAS_LISTEN_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.listenPath.value"]', this.page); }
  get OAS_ENABLE_AUTH_TOGGLE() { return new Toggle_object('//label[text()="Enable Authentication"]//following::li[contains(@class, "tyk-toggle__item ")]//input', this.page); }
  get OAS_AUTHENTICATION_DROPDOWN() { return new DropDown_object('//span[@title="Select authentication type"]', this.page); }
  get OAS_CHOSEN_AUTH_TYPES_DROPDOWN() { return new DropDown_object('//div[@name="multi-auth"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_BASE_IDENTITY_PROVIDER_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.baseIdentityProvider"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.url"]', this.page); }
  get OAS_NEXT_BUTTON() { return new SlowButton_object('span:text("Configure Api")', this.page); }
  get OAS_SEARCH_ICON() { return new Button_object('//i[contains(@class,"fa-search")]', this.page); }
  get OAS_SEARCH_BAR() { return new Input_object('//input[@name="search"]', this.page); }
  get OAS_SEARCH_BAR_CLOSE_ICON() { return new Button_object('//button[contains(@class, "search-input__close-btn")]', this.page); }
  get OAS_SEARCH_BAR_CLEAR_ICON() { return new Button_object('//input[@name="search"]//following::button[1]', this.page); }
  get OAS_HIDDEN_MATCH_MSG() { return this.page.locator('//p[contains(@class, "hidden-search-results__message")]'); }
  get OAS_SAVE_BUTTON() { return new SlowButton_object('//button[@type="submit"]', this.page); }
  get OAS_AUTHENTICATION_SAVED() { return this.page.locator('//label[text()="Authentication"]//following::p[1]'); }
  get OAS_CHOSEN_AUTH_TYPES_SAVED() { return this.page.locator('//label[text()="Chosen Authentication Types"]//following::div[2]'); }
  get OAS_BASE_IDENTITY_PROVIDER_SAVED() { return this.page.locator('//label[text()="Base Identity Provider"]//following::div[2]'); }
  get OAS_STRIP_AUTHORIZATION_DATA_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.stripAuthorizationData"]'); }

  //OAS CORS FIELDS
  get OAS_ENABLE_CORS_TOGGLE() { return new Toggle_object('//label[text()="Enable CORS"]//following::li[contains(@class, "tyk-toggle__item ")]//input', this.page); }
  get OAS_OPTIONS_PASS_THROUGH_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.middleware.global.cors.optionsPassthrough"]'); }
  get OAS_ALLOW_CREDENTIALS_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.middleware.global.cors.allowCredentials"]'); }
  get OAS_DEBUG_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.middleware.global.cors.debug"]'); }
  get OAS_MAX_AGE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cors.maxAge"]', this.page); }
  get OAS_ALLOWED_METHODS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedMethods"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_ALLOWED_ORIGINS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedOrigins"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_ALLOWED_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.allowedHeaders"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_EXPOSED_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cors.exposedHeaders"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_ALLOW_ALL_ORIGINS_BOX() { return this.page.locator('//label[contains(text(),"Allow All Origins")]//input'); }
  get OAS_ALLOW_ALL_HEADERS_BOX() { return this.page.locator('//label[contains(text(),"Allow All Headers")]//input'); }
  get OAS_MAX_AGE_SAVED() { return this.page.locator('//span[text()="Max Age (seconds)"]//following::div[2]'); }
  get OAS_ALLOWED_METHODS_SAVED() { return this.page.locator('//span[text()="Allowed Methods"]//following::div[2]'); }
  get OAS_ALLOWED_ORIGINS_SAVED() { return this.page.locator('//span[text()="Allowed Origins"]//following::div[2]'); }
  get OAS_ALLOWED_HEADERS_SAVED() { return this.page.locator('//span[text()="Allowed Headers"]//following::div[2]'); }
  get OAS_EXPOSED_HEADERS_SAVED() { return this.page.locator('//span[text()="Exposed Headers"]//following::div[2]'); }

  //OAS CACHE FIELDS
  get OAS_ENABLE_CACHE_TOGGLE() { return new Toggle_object('//label[text()="Enable Caching"]//following::li[contains(@class, "tyk-toggle__item ")]//input', this.page); }
  get OAS_UPSTREAM_CACHE_CONTROL_BOX() { return new Checkbox_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.enableUpstreamCacheControl"]', this.page); }
  get OAS_CACHE_TIMEOUT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.timeout"]', this.page); }
  get OAS_CACHE_RESPONSE_CODES_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheResponseCodes"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_CACHE_ALL_SAVE_REQUEST_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.middleware.global.cache.cacheAllSafeRequests"]'); }
  get OAS_ADVANCED_OPTIONS_ACCORDION() { return new Accordion_object('//label[text()="Enable Caching"]//following::button[@class="tyk-accordion__trigger"][1]', this.page); }
  get OAS_CACHE_BY_HEADERS_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.middleware.global.cache.cacheByHeaders"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_CACHE_CONTROL_TTL_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.middleware.global.cache.controlTTLHeaderName"]', this.page); }
  get OAS_CACHE_TIMEOUT_SAVED() { return this.page.locator('//span[text()="Cache Timeout"]//following::div[2]'); }
  get OAS_CACHE_RESPONSE_CODES_SAVED() { return this.page.locator('//span[text()="Cache Response Codes"]//following::div[2]'); }
  get OAS_CACHE_BY_HEADERS_SAVED() { return this.page.locator('//span[text()="Cache by Headers"]//following::div[2]'); }
  get OAS_CACHE_CONTROL_TTL_HEADER_SAVED() { return this.page.locator('//span[text()="Cache Control TTL Header"]//following::div[2]'); }

  //SERVICE DISCOVERY FIELDS
  get OAS_ENABLE_SD_TOGGLE() { return new Toggle_object('//label[text()="Enable Service Discovery"]//following::li[contains(@class, "tyk-toggle__item ")]//input', this.page); }
  get OAS_SD_PRESETS_DROPDOWN() { return new DropDown_object('//span[text()="Presets"]//following::div[@class="tyk-form-control"][1]', this.page); }
  get OAS_SD_QUERY_ENDPOINT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.queryEndpoint"]', this.page); }
  get OAS_SD_TARGET_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.targetPath"]', this.page); }
  get OAS_SD_ENABLE_CACHE_TIMEOUT_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.enableCacheTimeout"]'); }
  get OAS_SD_CACHE_TIMEOUT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.cacheTimeout"]', this.page); }
  get OAS_SD_RESPONSE_CONFIG_ACCORDTION() { return new Accordion_object('//label[text()="Enable Service Discovery"]//following::button[@class="tyk-accordion__trigger"][1]', this.page); }
  get OAS_SD_ENDPOINT_RETURNS_LIST_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.endpointReturnsList"]'); }
  get OAS_SD_ENDPOINT_PROVIDES_TARGET_LIST_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useTargetList"]'); }
  get OAS_SD_PORT_IS_SEPARATE_BOX() { return this.page.locator('//input[@name="showPortPath"]'); }
  get OAS_SD_PORT_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.portDataPath"]', this.page); }
  get OAS_SD_VALUES_ARE_NESTED_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.useNestedQuery"]'); }
  get OAS_SD_PARENT_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.parentDataPath"]', this.page); }
  get OAS_SD_DATA_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.upstream.serviceDiscovery.dataPath"]', this.page); }
  get OAS_SD_QUERY_ENDPOINT_SAVED() { return this.page.locator('//span[text()="Query Endpoint"]//following::div[2]'); }
  get OAS_SD_TARGET_PATH_SAVED() { return this.page.locator('//span[text()="Target Path"]//following::div[2]'); }
  get OAS_SD_CACHE_TIMEOUT_SAVED() { return this.page.locator('(//span[text()="Cache Timeout"]//following::div[2])[1]'); }
  get OAS_SD_PORT_DATA_PATH_SAVED() { return this.page.locator('//span[text()="Port Data Path"]//following::div[2]'); }
  get OAS_SD_PARENT_DATA_PATH_SAVED() { return this.page.locator('//span[text()="Parent Data Path"]//following::div[2]'); }
  get OAS_SD_DATA_PATH_SAVED() { return this.page.locator('//span[text()="Data Path"]//following::div[2]'); }

  //OAS AUTHENTICATION FIELDS

  //AUTH TOKEN
  get OAS_AUTH_TOKEN_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//div[@class="tyk-form-control"][1]', this.page); }
  get OAS_AUTH_TOKEN_USE_HEADER_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.header.enabled"]'); }
  get OAS_AUTH_TOKEN_USE_QUERY_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.query.enabled"]'); }
  get OAS_AUTH_TOKEN_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.cookie.enabled"]'); }
  get OAS_AUTH_TOKEN_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.header.name"]', this.page); }
  get OAS_AUTH_TOKEN_QUERY_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.query.name"]', this.page); }
  get OAS_AUTH_TOKEN_COOKIE_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.cookie.name"]', this.page); }
  get OAS_AUTH_TOKEN_CONFIG_NAME_SAVED() { return this.page.locator('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.token.name"]//div[@class="tyk-form-control--readonly"]'); }
  get OAS_AUTH_TOKEN_HEADER_NAME_SAVED() { return this.page.locator('//label[text()="Auth Key Header Name"]//following::div[1]'); }
  get OAS_AUTH_TOKEN_QUERY_NAME_SAVED() { return this.page.locator('//label[text()="Query parameter Name"]//following::div[1]'); }
  get OAS_AUTH_TOKEN_COOKIE_NAME_SAVED() { return this.page.locator('//label[text()="Cookie Name"]//following::div[1]'); }

  //JWT
  get OAS_JWT_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.name"]//div[@class="tyk-form-control"][1]', this.page); }
  get OAS_JWT_SIGNING_METHOD_DROPDOWN() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.signingMethod"]//div[@class="tyk-form-control"]', this.page); }
  get OAS_JWT_IDENTITY_SOURCE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.identityBaseField"]', this.page); }
  get OAS_JWT_POLICY_FIELD_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.policyFieldName"]', this.page); }
  get OAS_JWT_USE_HEADER_BOX() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.header.enabled"]', this.page); }
  get OAS_JWT_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.jwt.header.name"]', this.page); }

  //BASIC AUTH
  get OAS_BASICAUTH_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.name"]//div[@class="tyk-form-control"][1]', this.page); }
  get OAS_BASICAUTH_ENABLE_CHACHING_BOX() { return this.page.locator('//label[contains(text(),"Enable Caching")]//input'); }
  get OAS_BASICAUTH_CACHE_TTL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cacheTTL"]', this.page); }
  get OAS_BASICAUTH_EXTRACT_CREDENTIALS_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.enabled"]'); }
  get OAS_BASICAUTH_REGEXP_USERNAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.userRegexp"]', this.page); }
  get OAS_BASICAUTH_REGEXP_PASSWORD_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.extractCredentialsFromBody.passwordRegexp"]', this.page); }
  get OAS_BASICAUTH_USE_HEADER_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.header.enabled"]'); }
  get OAS_BASICAUTH_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.header.name"]', this.page); }
  get OAS_BASICAUTH_STRIP_AUTHDATA_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.stripAuthorizationData"]'); }
  get OAS_BASICAUTH_ALLOW_QUERY_PARAM_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.query.enabled"]'); }
  get OAS_BASICAUTH_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cookie.enabled"]'); }
  get OAS_BASICAUTH_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.query.name"]', this.page); }
  get OAS_BASICAUTH_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.cookie.name"]', this.page); }
  get OAS_BASICAUTH_CACHE_TTL_SAVED() { return this.page.locator('//span[text()="Cache TTL"]//following::div[2]'); }
  get OAS_BASICAUTH_CONFIG_NAME_SAVED() { return this.page.locator('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.basic.name"]//div[@class="tyk-form-control--readonly"]'); }
  get OAS_BASICAUTH_REGEXP_USERNAME_SAVED() { return this.page.locator('//span[text()="Regexp to Extract Username"]//following::div[2]'); }
  get OAS_BASICAUTH_REGEXP_PASSWORD_SAVED() { return this.page.locator('//span[text()="Regexp to Extract Password"]//following::div[2]'); }
  get OAS_BASICAUTH_AUTH_HEADER_SAVED() { return this.page.locator('//label[text()="Auth Key Header Name"]//following::div[1]'); }
  get OAS_BASICAUTH_QUERY_PARAM_SAVED() { return this.page.locator('//label[text()="Query parameter Name"]//following::div[1]'); }
  get OAS_BASICAUTH_COOKIE_VALUE_SAVED() { return this.page.locator('//label[text()="Cookie Name"]//following::div[1]'); }

  //HMAC
  get OAS_HMAC_ALLOWED_ALGORITHMS_DROPDOWN() { return new DropDown_object('//label[text()="Allowed Algorithms"]//following::div[@class="tyk-form-control"][1]', this.page); }
  get OAS_HMAC_ENABLE_CLOCK_SKEW_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.hmac.enableClockSkew"]'); }
  get OAS_HMAC_CLOCK_SKEW_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.allowedClockSkew"]', this.page); }
  get OAS_HMAC_USE_AUTH_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.hmac.header.enabled"]'); }
  get OAS_HMAC_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.header.name"]', this.page); }
  get OAS_HMAC_ALLOW_QUERY_PARAM_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.hmac.query.enabled"]'); }
  get OAS_HMAC_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.hmac.cookie.enabled"]'); }
  get OAS_HMAC_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.query.name"]', this.page); }
  get OAS_HMAC_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.hmac.cookie.name"]', this.page); }

  //OAUTH 2.0
  get OAS_OAUTH_CONFIG_NAME() { return new DropDown_object('//div[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.name"]//div[@class="tyk-form-control"][1]', this.page); }
  get OAS_OAUTH_NOTIFICATIONS_ACCORDTION() { return new Accordion_object('//label[text()="Enable Authentication"]//following::button[@class="tyk-accordion__trigger"][1]', this.page); }
  get OAS_OAUTH_AUTHORIZATION_CODE_BOX() { return this.page.locator('//input[@name="authorization_code"]'); }
  get OAS_OAUTH_LOGIN_REDIRECT_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.authLoginRedirect"]', this.page); }
  get OAS_OAUTH_CLIENT_CREDENTIALS_BOX() { return this.page.locator('//input[@name="client_credentials"]'); }
  get OAS_OAUTH_PASSWORD_BOX() { return this.page.locator('//input[@name="password"]'); }
  get OAS_OAUTH_REFRESH_TOKEN_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.refreshToken"]'); }
  get OAS_OAUTH_NOTIFICATIONS_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.onKeyChangeUrl"]', this.page); }
  get OAS_OAUTH_NOTIFICATIONS_SECRET_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.notifications.sharedSecret"]', this.page); }
  get OAS_OAUTH_USE_HEADER_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.header.enabled"]'); }
  get OAS_OAUTH_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.header.name"]', this.page); }
  get OAS_OAUTH_ALLOW_QUERY_PARAM_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.query.enabled"]'); }
  get OAS_OAUTH_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.cookie.enabled"]'); }
  get OAS_OAUTH_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.query.name"]', this.page); }
  get OAS_OAUTH_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.securitySchemes.oauth.cookie.name"]', this.page); }

  //OpenID Connect
  get OAS_OIDC_ENABLE_RL_PER_CLIENT_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.oidc.segregateByClientId"]'); }
  get OAS_OIDC_ADD_NEW_ISSUER_BUTTON() { return new Button_object('span:text-is("Add New Issuer")', this.page); }
  get OAS_OIDC_ISSUER_ONE_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]', this.page); }
  get OAS_OIDC_ISSUER_TWO_TARGET_URL_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]', this.page); }
  get OAS_OIDC_ADD_CLIENT_ONE_BUTTON() { return new Button_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::span[text()="Add Client"][1]', this.page); }
  get OAS_OIDC_ADD_CLIENT_TWO_BUTTON() { return new Button_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::span[text()="Add Client"][1]', this.page); }
  get OAS_OIDC_MAP_CLIENT_TO_POLICY_ONE_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[0].issuer"]//following::ul[1]', this.page); }
  get OAS_OIDC_MAP_CLIENT_TO_POLICY_TWO_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.providers[1].issuer"]//following::ul[1]', this.page); }
  get OAS_OIDC_ENABLE_SCOPE_CLAIMS_BOX() { return this.page.locator('//input[@name="enableScopeClaim"]'); }
  get OAS_OIDC_SCOPE_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.scopes.claimName"]', this.page); }
  get OAS_OIDC_ADD_CLAIM_BUTTON() { return new Button_object('span:text-is("Add Claim")', this.page); }
  get OAS_OIDC_MAP_CLAIM_TO_POLICY_FIRST_TABLE() { return new OasMapToPolicyTable_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.scopes.claimName"]//following::ul[1]', this.page); }
  get OAS_OIDC_USE_HEADER_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.oidc.header.enabled"]'); }
  get OAS_OIDC_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.header.name"]', this.page); }
  get OAS_OIDC_ISSUER_ONE_ACCORDTION() { return new Accordion_object('//h3[text()="Issuer one"]//preceding::button[@class="tyk-accordion__trigger"][1]', this.page); }
  get OAS_OIDC_ISSUER_TWO_ACCORDTION() { return new Accordion_object('//h3[text()="Issuer two"]//preceding::button[@class="tyk-accordion__trigger"][1]', this.page); }
  get OAS_OIDC_ALLOW_QUERY_PARAM_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.oidc.query.enabled"]'); }
  get OAS_OIDC_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.oidc.cookie.enabled"]'); }
  get OAS_OIDC_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.query.name"]', this.page); }
  get OAS_OIDC_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.oidc.cookie.name"]', this.page); }

  //CUSTOM AUTH PLUGIN
  get OAS_CUSTOM_AUTH_USEHEADER_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.custom.header.enabled"]'); }
  get OAS_CUSTOM_AUTH_HEADER_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.header.name"]', this.page); }
  get OAS_CUSTOM_ALLOW_QUERY_PARAM_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.custom.query.enabled"]'); }
  get OAS_CUSTOM_USE_COOKIE_BOX() { return this.page.locator('//input[@name="x-tyk-api-gateway.server.authentication.custom.cookie.enabled"]'); }
  get OAS_CUSTOM_QUERY_PARAM_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.query.name"]', this.page); }
  get OAS_CUSTOM_COOKIE_VALUE_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.cookie.name"]', this.page); }
  get OAS_CUSTOM_PLUGIN_CONFIG_TOGGLE() { return new Toggle_object('(//span[text()="Enable Plugin Config"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]', this.page); }
  get OAS_CUSTOM_FUNCTION_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.functionName"]', this.page); }
  get OAS_CUSTOM_PATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.path"]', this.page); }
  get OAS_CUSTOM_RAW_BODY_TOGGLE() { return new Toggle_object('(//span[text()="Raw Body Only"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]', this.page); }
  get OAS_CUSTOM_REQUIRE_SESSION_TOGGLE() { return new Toggle_object('(//span[text()="Require Session"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]', this.page); }
  get OAS_CUSTOM_IDEXTRACTOR_TOGGLE() { return new Toggle_object('(//span[text()="Enable ID Extractor"]//following::li[contains(@class, "tyk-toggle__item ")]//input)[1]', this.page); }
  get OAS_CUSTOM_EXTRACT_FROM_DROPDOWN() { return new DropDown_object('//span[text()="Extract From"]//following::div[@class="tyk-form-control"][1]', this.page); }
  get OAS_CUSTOM_EXTRACT_WITH_DROPDOWN() { return new DropDown_object('//span[text()="Extract With"]//following::div[@class="tyk-form-control"][1]', this.page); }
  get OAS_CUSTOM_HEADER_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.headerName"]', this.page); }
  get OAS_CUSTOM_FORM_PARTAM_NAME_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.formParamName"]', this.page); }
  get OAS_CUSTOM_REGEXP_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.regexp"]', this.page); }
  get OAS_CUSTOM_REGEXP_INDEX_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.regexpMatchIndex"]', this.page); }
  get OAS_CUSTOM_XPATH_INPUT() { return new Input_object('//input[@name="x-tyk-api-gateway.server.authentication.custom.config.idExtractor.config.xPathExp"]', this.page); }


  //TOP BUTTONS
  get CONFIGURE_API_BUTTON() { return new SlowButton_object('span:text-is("Configure Api")', this.page); }
  get SAVE_BUTTON() { return new Button_object(this.page.getByRole('button', { name: 'Save' }), this.page); }
  get OPTIONS_BUTTON() { return new Button_object('span:text-is("OPTIONS")', this.page); }
  get DELETE_BUTTON() { return new SlowButton_object(this.page.locator('a').filter({ hasText:'Delete' }), this.page); }
  get UPDATE_BUTTON() { return new Button_object(this.page.locator('span').filter({ hasText:'Update' }), this.page); }

  //MODALS
  get MODAL() { return this.page.locator('.tyk-modal__content'); }
  get DELETE_API_BUTTON() { return this.MODAL.locator('//button//span[text()="Delete API"]'); }
  get UPDATE_API_BUTTON() { return this.MODAL.locator('//button//span[text()="Update API"]'); }
  get CONFIRM_BUTTON() { return this.MODAL.locator('//button//span[text()="Confirm"]'); }

  //API MESSAGE POPUPS
  get API_UPDATED_MESSAGE() { return this.page.locator('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully updated"]'); }
  get API_DELETED_MESSAGE() { return this.page.locator('//div[contains(@class, "alert-success")]//span[text()="The Api has been successfully deleted"]').first(); }

  get api_created_expected_mesage() { return 'API successfully created'; }
  async isApiCreatedPopUpDisplayed() { return await this.isSuccessPopupDisplayedWithText(this.api_created_expected_mesage); }

  get api_updated_expected_mesage() { return 'API successfuly updated'; }
  async isApiUpdatedPopUpDisplayed() { return await this.isSuccessPopupDisplayedWithText(this.api_updated_expected_mesage); }

  async waitUntilPageLoaded() {
    return await super.waitUntilPageLoaded(this.ADD_NEW_API_BUTTON);
  }

}