'use strict';

const express = require('express');
const router = express.Router();
const url = require('url'); 
const MemberService = require('../services/member');

async function memberList(req, res, next) {
    console.log(" -- memberList req.params :", req.body);
    console.log(" == memberList req.query :", req.query);

    const params = req.body;
    const ret = await MemberService.getMembers(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('member.ejs', {title: "GraphDB Test - Member", nav:"member", data: ret.result.data});
}

async function memberListByCompanyId(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);

    const params = req.query;
    const ret = await MemberService.getMembersByCompanyId(params);
    //console.log("------ ret.data:", ret.result.data);
    return res.render('memberByCompany.ejs', {title: "GraphDB Test - Member", nav:"member", data: ret.result.data});
}

async function addMember(req, res, next) {
    console.log(" -- req.params :", req.body);
    console.log(" == req.query :", req.query);
    

    const params = req.body;
    const ret = await MemberService.addMember(params);
    //const data = await MemberService.getMembers(params);
    return res.redirect(url.format({
        pathname:"/member/",
        query:req.query,
      }));
  
}



router.get('/', memberList);
router.get('/list', memberListByCompanyId);
router.post('/add', addMember);


module.exports = router;
