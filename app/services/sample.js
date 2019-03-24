'use strict';
var fs = require("fs");
const util = require('util');
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

async function getSamples(params) {
    try {
        const data = await readFile( __dirname + "/../data/" + "sample.json", 'utf8');
        console.log( data );            
        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

function __returnError(err) {
    return { error: err ? err : 'error', result: null };
}

function __returnData(data, isSuccess = true) {
    let ret = {
        success: isSuccess,
        data: data || null
    };
    return { error: null, result: ret };
}

module.exports = {
    getSamples: getSamples
};