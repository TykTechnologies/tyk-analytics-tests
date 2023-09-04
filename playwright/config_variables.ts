import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.URL || "http://localhost:3000/";
const GW_URL = process.env.GW_URL || "http://localhost:8080/";
const FEDERATION_UPSTREAM_HOST = (process.env.CI) ? "federation" : "localhost";

export const config = {
    CLEAN_TEST: process.env.CLEAN_TEST || true,

    URL: URL,
    GATEWAY_API: GW_URL,
    DASHBOARD_API: URL + 'api/',
    DASHBOARD_ADMIN_API: URL + 'admin/',
    GW_HELLO_API: GW_URL + 'hello',

    USER_EMAIL: process.env.USER_EMAIL || "test123@tyk.io",
    USER_SECRET: process.env.USER_SECRET || "",
    USER_PASSWORD: process.env.USER_PASSWORD || "test123",
    
    ORG_NAME: process.env.ORG_NAME || "Auto-test-org",
    ADMIN_SECRET: process.env.ADMIN_SECRET || "12345",
    
    ORG_API_PATH: "organisations/",
    USERS_API_PATH: "users/",

    LOGOUT_PATH: "logout/",
    HELLO_PATH: "hello/",

    FEDERATION_UPSTREAM_HOST: FEDERATION_UPSTREAM_HOST
};