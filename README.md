# UI Automated Tests

[Test coverage](coverage.md)

## Dashboard UI automation test suite based on:

1. Node.js
2. [Webdriverio](https://webdriver.io/)
3. [Timeline reporter](https://github.com/QualityOps/wdio-timeline-reporter) for reporting

## How to run tests
1. Clone repository
2. Install Dependencies
```
'npm install'
```
4. Execute tests using ```npm test``` or ```npm headless-test```
5. Report will be generated in results/report

## Configuration
We can execute test with following variables [default values]:
- URL [http://localhost:3000/] - dashboard UI url
- ADMIN_SECRET [12345] - admin secrted on environment
- CLEAN_TEST [true] - decide if test should be run on new Org and user

Below variables will be used only if __CLEAN_TEST__ set to **false**
- USER_SECRET - user_secret to be used for API calls
- USER_EMAIL - email to be used for log-in
- USER_PASSWORD - password to be used for log-in

## Test template
For creating new tests please copy and rename **template_test.js** file into test/specs/
