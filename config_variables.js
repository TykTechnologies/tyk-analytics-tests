require('dotenv').config();

const URL = process.env.URL || "http://localhost:3000/";

module.exports = {
    CLEAN_TEST: process.env.CLEAN_TEST || true,

    URL: URL,
    DASHBOARD_API: URL + 'api/',
    DASHBOARD_ADMIN_API: URL + 'admin/',
    
    USER_EMAIL: process.env.USER_EMAIL,
    USER_SECRET: process.env.USER_SECRET,
    USER_PASSWORD: process.env.USER_PASSWORD || "test123",
    
    ORG_NAME: process.env.ORG_NAME || "Auto-test-org",
    ADMIN_SECRET: process.env.ADMIN_SECRET || "12345",
    
    ORG_API_PATH: "organisations/",
    USERS_API_PATH: "users/",
};