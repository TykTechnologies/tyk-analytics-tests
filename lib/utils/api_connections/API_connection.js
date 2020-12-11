const superagent = require('superagent');
const config_variables = require('../../../config_variables');
const Promise = require('bluebird');

export class API_connection {
    constructor(url) {
        this.url = url;
    }
    
    sendGetRequest(config) {
        console.debug(`>>> Sending GET request to ${this.url}${config.path}`);
        const response = browser.call(() => this.sendGetRequestPromise(config));
        return response;
    };

    sendPostRequest(config) {
        console.debug(`>>> Sending POST request to ${this.url}${config.path}, body: ${config.body}`);
        const response = browser.call(() => this.sendPostRequestPromise(config));
        return response;
    };

    sendPutRequest(config) {
        console.debug(`>>> Sending PUT request to ${this.url}${config.path}, body: ${config.body}`);
        const response = browser.call(() => this.sendPutRequestPromise(config));
        return response;
    };

    sendDeleteRequest(config) {
        console.debug(`>>> Sending DELETE request to ${this.url}${config.path}, param: ${config.param}`);
        const response = browser.call(() => this.sendDeleteRequestPromise(config));
        return response;
    };

    sendGetRequestPromise(config) {  
        return new Promise( (resolve, reject) => {
        console.debug(`>>> Sending request to ${this.url}${config.path}`);
        superagent
        .get(this.url + config.path)
        .set(config.headers)
        .then((response) => {
            console.debug(`>>> response status: ${response.status}`);
            resolve(response);})
        .catch( err => {console.log(err);});
        
        });
    };

    sendPostRequestPromise(config) {
        if (config.headers === undefined) {config.headers = {};}      
        return new Promise( (resolve, reject) => {
        console.debug(`>>> Sending request to ${this.url}${config.path}`);
        superagent
        .post(this.url + config.path)
        .send(config.body)
        .set(config.headers)
        .then((response) => {
            console.debug(`>>> response status: ${response.status}`);
            resolve(response);})
        .catch( err => {console.log(err);});
        
        });
    };

    sendPutRequestPromise(config) {
        if (config.headers === undefined) {config.headers = {};}      
        return new Promise( (resolve, reject) => {
        console.debug(`>>> Sending PUT request to ${this.url}${config.path}`);
        superagent
        .put(this.url + config.path)
        .send(config.body)
        .set(config.headers)
        .then((response) => {
            console.debug(`>>> response status: ${response.status}`);
            resolve(response);})
        .catch( err => {console.log(err);});
        
        });
    };

    sendDeleteRequestPromise(config) {
        if (config.headers === undefined) {config.headers = {};}      
        return new Promise( (resolve, reject) => {
        console.debug(`>>> Sending request to ${this.url}${config.path}`);
        superagent
        .del(this.url + config.path)
        .send(config.param)
        .set(config.headers)
        .then((response) => {
            console.debug(`>>> response status: ${response.status}`);
            resolve(response);})
        .catch( err => {console.log(err);});       
        });
    };
};