# UI Automated Tests

[Test coverage](coverage.md)

## Dashboard UI automation test suite based on:

1. TypeScript
2. [Playwright](https://playwright.dev/)

## How to start env
You can execute tests on any env (each test will create separate org and users in it).
In this repo we have simple docker compose that will build and start all components for you. Just make sure you don't have any dash or GW running on your local and you provided the dash license.

Provide paths and license in .env file and execute command that will create images from your local repo:
```
make start-env
```
Or command that will images available in docker hub:
```
make start-env-images
```
## How to run tests
1. Clone repository
2. Install Dependencies
```
npm install
npx playwright install --with-deps
```
4. Execute tests using ```npm run test``` 
5. Report will be generated in playwright-report

Note: You can also use VS code pluggin or ```npm run gui``` to run tests on local

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

## Wrappers
In all UI frameworks we share the logic that encapsulate the objects on web page - we call it _wrappers_, and we store it in separate repo.
If you want to add/modify _wrapper_ method please follow the instruction [here](https://github.com/TykTechnologies/tyk-test-automation-wrappers#how-to-update-wrappers)