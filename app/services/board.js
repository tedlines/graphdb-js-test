'use strict';
var fs = require("fs");
const util = require('util');

// orientDB
// const Board = require("../models/orientdb/board");
// const Company = require("../models/orientdb/company");

// gremlin
const Board = require("../models/" + process.env.USE_DB + "/board");
const Company = require("../models/" + process.env.USE_DB + "/company");


async function getBoards(params) {
    try {
        let data = {};
        data.boards = await Board.getBoards();
        data.Companies = await Company.getCompanies();         
        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function addBoard(params) {
    try {
        const retVertex = await Board.addBoard(params.boardId, params.name);
        //console.log( retVertex );        
        const retEdge = await Board.addAllowTo(params.boardId, params.companyId)
        
        return __returnData(retVertex);
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
    getBoards: getBoards,
    addBoard: addBoard
};