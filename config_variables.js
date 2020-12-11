require('dotenv').config();

export const CLEAN_TEST = process.env.CLEAN_TEST || true;
export const URL = process.env.URL || "http://localhost:3000/";
export const DASHBOARD_API = URL + 'api/';
export const DASHBOARD_ADMIN_API = URL + 'admin/';
export const USER_EMAIL = process.env.USER_EMAIL;
export const USER_SECRET = process.env.USER_SECRET;
export const USER_PASSWORD = process.env.USER_PASSWORD || "test123";
export const ORG_NAME = process.env.ORG_NAME || "Auto-test-org";
export const ADMIN_SECRET = process.env.ADMIN_SECRET || "12345";
export const ORG_API_PATH = "organisations/";
export const USERS_API_PATH = "users/";
