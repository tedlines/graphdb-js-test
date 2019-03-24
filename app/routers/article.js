'use strict';

const express = require('express');
const router = express.Router();
const url = require('url'); 
const ArticleService = require('../services/article');

async function articleList(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);

    const params = req.body;
    const ret = await ArticleService.getArticles(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('article.ejs', {title: "GraphDB Test - Article", nav:"article", data: ret.result.data});
}

async function articleListByBoardId(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);

    const params = req.query;
    const ret = await ArticleService.getArticlesByBoardId(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('articleByBoard.ejs', {title: "GraphDB Test - Article", nav:"article", data: ret.result.data});
}

async function getArticle(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.query;
    const ret = await ArticleService.getArticle(params);
    //const data = await ArticleService.getArticles(params);
    console.log("===== ret :", ret.result.data);
    return res.render('articleDetail.ejs', {title: "GraphDB Test - Article", nav:"article", data: ret.result.data});
}

async function addArticle(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.body;
    const ret = await ArticleService.addArticle(params);
    
    return res.redirect(url.format({
        pathname:"/article/",
        query:req.query,
      }));
}

async function readArticle(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.body;
    const ret = await ArticleService.readArticle(params);
    const query = {articleId: params.articleId};
    return res.redirect(url.format({
        pathname:"/article/get",
        query: query,
      }));
}


router.get('/', articleList);
router.get('/list', articleListByBoardId);
router.get('/get', getArticle);
router.post('/add', addArticle);
router.post('/read', readArticle);



module.exports = router;
