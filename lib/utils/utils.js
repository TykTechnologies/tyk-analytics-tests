import { exec } from 'child_process';
import moment from 'moment';
const bashCmdExecutor = require('child_process').exec;
import { API_connection } from './api_connections/API_connection';
const randomEmailGenerator = require('random-email');

/** generating random email in format name+11-Feb-9_39_41@example.com
 * @function
 * @return {string} random email
**/
export const generateRandomEmail = () => {
    const randomEmail = randomEmailGenerator({ domain: 'example.com' });
    return randomEmail.replace('@', `+${moment().format('h_mm_ss')}@`);
};