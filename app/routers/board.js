'use strict';

const express = require('express');
const router = express.Router();
const url = require('url'); 
const BoardService = require('../services/board');

async function boardList(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);

    const params = req.body;
    const ret = await BoardService.getBoards(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('board.ejs', {title: "GraphDB Test - Board", nav:"board", data: ret.result.data});
}

async function addBoard(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.body;
    const ret = await BoardService.addBoard(params);
    //const data = await BoardService.getBoards(params);
    return res.redirect(url.format({
        pathname:"/board/",
        query:req.query,
      }));
  
}



router.get('/', boardList);
router.post('/add', addBoard);


module.exports = router;
