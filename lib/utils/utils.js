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

    // exec('(cd graphql-go-tools/examples/federation ; ./start.sh)');

    exec('graphql-go-tools/examples/federation');
    exec('go build -o /tmp/srv-accounts ./accounts');
    exec('go build -o /tmp/srv-products ./products');
    exec('go build -o /tmp/srv-reviews ./reviews');
    exec('go build -o /tmp/srv-gateway ./gateway');
    exec('/tmp/srv-accounts &');
    exec('/tmp/srv-products &');
    exec('/tmp/srv-reviews &');
    exec('sleep 1');
    exec('/tmp/srv-gateway');

    // , (error, stdout, stderr) => {
    //     console.debug(`>>> Inside Federation start.sh logs start here:`);
    //     console.debug(`Error: ${error.message}`);
    //     console.debug(`>>> Federation start.sh logs start here:`);
    //     console.debug(`stdout: ${stdout.message}`);
    //     console.debug(`stderr: ${stderr.message}`);            
    // });
};