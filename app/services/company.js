'use strict';
var fs = require("fs");
const util = require('util');

//const Company = require("../models/orientdb/company");
const Company = require("../models/" + process.env.USE_DB + "/company");


async function getCompanies(params) {
    try {
        const data = await Company.getCompanies();
        //console.log( "------- getCompanies : ", data );            
        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function addCompany(params) {
    try {
        const data = await Company.addCompany(params.companyId, params.name);
        //console.log( data );            
        
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
    getCompanies: getCompanies,
    addCompany: addCompany
};