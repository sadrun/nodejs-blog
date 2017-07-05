var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mysql = require('mysql');
var flash = require('connect-flash'); 
//var session = require('express-session');

var chatServer = require('./lib/chat_server');

var routes = require('./routes');
var port = 18080;
var app = express();

// view engine setup
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//app.use(express.favicon(__dirname + '/public/images/favicon.ico');
app.use(flash());
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images' }));
app.use(express.methodOverride());
app.use(cookieParser("sky"));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//路由
routes(app)

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log();  
    console.log();  
    console.log('/****************测试**********************************/');  
    console.log('/*  我的第一个NODE.JS例子：MiniSky。BY 牛小白 2015-11-9  */');  
    console.log('/*   欢迎访问我的博客：   */');  
    console.log('/**************************************************/');  
    console.log('============服务启动成功，监听端口：' + app.get('port')+"============"); 
});

chatServer.listen(server);