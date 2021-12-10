import { exec } from 'child_process';
import moment from 'moment';
const bashCmdExecutor = require('child_process').exec;
const randomEmailGenerator = require('random-email');

/** generating random email in format name+11-Feb-9_39_41@example.com
 * @function
 * @return {string} random email
**/
export const generateRandomEmail = () => {
    const randomEmail = randomEmailGenerator({ domain: 'example.com' });
    return randomEmail.replace('@', `+${moment().format('D-MMM-h_mm_ss')}@`);
};

export const runFederationExample = () => {
    console.log('>>> Checking presence of federation start.sh file');
    exec('ls graphql-go-tools/examples/federation | grep start.sh', (error, stdout, stderr) => {
        if(error){
            console.log('Error: ', error.message);
            return;
        }
        else{
            console.log(`>>> If you see "start.sh" at the end of this line, we're good: ${stdout}`)
        }        
    });
    
    console.log('>>> Running Federation example');

    exec('(cd graphql-go-tools/examples/federation ; sh start.sh)');
};