/*
 * server.js
 * 服务器入口
 * */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

//routes
var wechat = require('./routes/wechat');
var index = require('./routes/index');
var game = require('./routes/game');

//custom
require('./scripts/constants');

//express
var app = express();
app.use(express.query());
app.use('/', index);
app.use('/game', game);
app.use('/wechat', wechat);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
  var err = new Error('Not Found');
  // err.status = 404;
  mylog('request err, not found. req=' + req.originalUrl);
});

app.listen(18080);

/*
 * Socket.IO
 * */
var server = require('./routes/scoketio');

mylog('server started.');
