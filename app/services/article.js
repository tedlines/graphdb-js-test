'use strict';
var fs = require("fs");
const util = require('util');

// orientDB
// const Article = require("../models/orientdb/article");
// const Board = require("../models/orientdb/board");
// const Member = require("../models/orientdb/member");

// gremlin
const Article = require("../models/" + process.env.USE_DB + "/article");
const Board = require("../models/" + process.env.USE_DB + "/board");
const Member = require("../models/" + process.env.USE_DB + "/member");

async function getArticles(params) {
    try {
        let data = {};
        data.articles = await Article.getArticles();
        data.boards = await Board.getBoards();
        data.members = await Member.getMembers();

        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function getArticlesByBoardId(params) {
    try {
        let data = {};
        data.articles = await Article.getArticlesByBoardId(params.boardId);
        
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function getArticle(params) {
    try {
        let data = {};
        data.articles = await Article.getArticle(params.articleId);
        data.members = await Member.getMembers();
        return __returnData(data);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function addArticle(params) {
    try {
        const retVertex = await Article.addArticle(params.articleId, params.title, params.content);
        //console.log( retVertex );   
        const retEdgeMember = await Article.addWrittenBy(params.articleId, params.memberId);
        const retEdgeBoard = await Article.addBelongTo(params.articleId, params.boardId);
        
        return __returnData(retVertex);
    } catch (e) {
        console.error(e);
        return __returnError('db');
    }
}

async function readArticle(params) {
    try {
        
        const retEdgeMember = await Article.addReadBy(params.articleId, params.memberId);
        
        return __returnData(retEdgeMember);
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
    getArticles: getArticles,
    getArticlesByBoardId: getArticlesByBoardId,
    getArticle: getArticle,
    addArticle: addArticle,
    readArticle: readArticle
};