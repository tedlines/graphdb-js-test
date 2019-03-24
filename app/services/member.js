'use strict';
var fs = require("fs");
const util = require('util');

// const Member = require("../models/orientdb/member");
//const Company = require("../models/orientdb/company");
const Member = require("../models/" + process.env.USE_DB + "/member");
const Company = require("../models/" + process.env.USE_DB + "/company");
const Article = require("../models/" + process.env.USE_DB + "/article");

async function getMembers(params) {
    try {
        let data = {};
        data.members = await Member.getMembers();
        data.Companies = await Company.getCompanies();
        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function getMembersByCompanyId(params) {
    try {
        let data = {};
        data.members = await Member.getMembersByCompanyId(params.companyId);
        data.articles = await Article.getArticlesReadByCompanyMembers(params.companyId);
        console.log(data);
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function addMember(params) {
    try {
        const retMember = await Member.addMember(params.memberId, params.name, params.age);
        //console.log( retMember );            
        const retEdge = await Member.addWorkFor(params.memberId, params.companyId)
        return __returnData(retMember);
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
    getMembers: getMembers,
    getMembersByCompanyId: getMembersByCompanyId,
    addMember: addMember
};