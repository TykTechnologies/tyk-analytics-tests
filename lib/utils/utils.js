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
    return randomEmail.replace('@', `+${moment().format('D-MMM-h_mm_ss')}@`);
};

export const prepareFederationExampleUpstream = () => {
    let isUpstremRunning = waitForFederationUpstream();
    if (isUpstremRunning) {
        return true;
    };
    if(!checkIfFederationFilesExists()) {
        console.error(`Federation file "start.sh" does NOT exist!`);
        return false;
    }    
    
    console.log('>>> Running Federation example');
    bashCmdExecutor('(cd graphql-go-tools/examples/federation ; sh start.sh)').stdout.pipe(process.stdout);
    return waitForFederationUpstream(10);
};

const checkIfFederationFilesExists = () => {
    console.log('>>> Checking presence of federation start.sh file');
    exec('ls graphql-go-tools/examples/federation | grep start.sh', (error, stdout, stderr) => {
        if(error){
            console.error(`>>> Files in federation folder: ${stdout}`);
            console.error('>>> Error: ', error.message);
            return false;
        }
    });
    console.log(`>>> Federation file "start.sh" exists`);
    return true;
};

const waitForFederationUpstream = (retryMaxCount = 1) => {
    const federationExampleTestUrl = "http://localhost:4000/";
    const api_connection = new API_connection(federationExampleTestUrl);
    const expectedFederationResponse = { data: { me: { id: '1234' } } };
    const federationTestRequestConfig = {
        path: "query",
        body: `{"query":"query{me{id}}","variables":{}}`
    };   
    let retryNumber = 1;
    let isRunning = false;
    
    while(!isRunning && retryNumber <= retryMaxCount){        
        let response;
        console.log(`>>> Starting connection try number ${retryNumber}`);
        try {
            response = api_connection.sendPostRequest({path: federationTestRequestConfig.path, body: federationTestRequestConfig.body});    
            if(JSON.stringify(response.body) === JSON.stringify(expectedFederationResponse)) {
                console.log('>> Federation upstream works');
                return true;
            }                
        } catch (error) {
            console.error('Federation example not running. Trying again. ' + error);
        }
        retryNumber++;    
    }
    return isRunning;
};