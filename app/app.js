'use strict';
process.title = 'node-web-sample';
const CONFIG = {    
    port: 8080,
    root_dir: __dirname
};

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require("fs")


var server = app.listen(CONFIG.port, function () {
    console.log(' Server Started!!! ^______^ env : ' + process.env.NODE_ENV + ', port :' + CONFIG.port);
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// app.use(session({
//     secret: '@#@$MYSIGN#@$#$',
//     resave: false,
//     saveUninitialized: true
// }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

// regist routers
var files = fs.readdirSync(__dirname + '/routers');
//console.log(__dirname);
files.forEach(function(fname){ 
    let fname_split = fname.split('.');
    if(fname_split[fname_split.length - 1] !== 'js') {
        return true;
    }    
    let routeName = fname.replace('.js', '');
    app.use('/'+routeName, require('./routers/'+routeName));
    
});

// default router
app.use('/example', async function (req, res, next) {
    const tpl = CONFIG.root_dir + '/views/example.ejs';
    return res.render(tpl, {title: "GraphDB Test" });
});
app.use('/', async function (req, res, next) {
    const tpl = CONFIG.root_dir + '/views/index.ejs';
    return res.render(tpl, {title: "GraphDB Test", nav: 'index', use_db: process.env.USE_DB });
});


process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);
	process.exit(1);
});

