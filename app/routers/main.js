'use strict';

const express = require('express');
const router = express.Router();
const SampleService = require('../services/sample');

async function main(req, res, next) {
    console.log(" -- req.params :", req.params);
    console.log(" == req.query :", req.query);

    const params = req.params;
    const ret = await SampleService.getSamples(params);
    return res.render('main.ejs', {title: "Node + Expess + Bootstrap Sample", ret: JSON.stringify(ret,null, 2) });
}

router.get('/main', main);


module.exports = router;
