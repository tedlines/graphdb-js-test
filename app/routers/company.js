'use strict';

const express = require('express');
const router = express.Router();
const url = require('url'); 
const Companieservice = require('../services/company');

async function companyList(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);

    const params = req.body;
    const ret = await Companieservice.getCompanies(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('company.ejs', {title: "GraphDB Test - Company", nav:"company", data: ret.result.data});
}

async function addCompany(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.body;
    const ret = await Companieservice.addCompany(params);
    
    return res.redirect(url.format({
        pathname:"/company/",
        query:req.query,
      }));
  
}



router.get('/', companyList);
router.post('/add', addCompany);


module.exports = router;
