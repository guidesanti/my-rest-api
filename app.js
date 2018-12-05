// External libs
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('winston');
var appRoot = require('app-root-path');
var mongoose = require('mongoose');

// Configuration
var config = require('./config/config').getAppConfig();
var winstonConfig = require('./config/config').getWinstonConfig();

// The routers
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

var app = express();

// Database connection
mongoose.connect('mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db);

// Setup the logger
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(winstonConfig.file),
        new winston.transports.Console(winstonConfig.console)
    ]
});
logger.info("teste");
logger.error("error");

// Setup loggers, parsres, etc
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup non protected routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Setup protected routes
app.use('/', function (req, res, next) {
    console.log('Middleware in action');
    next();
});
app.use('/users', usersRouter);

module.exports = app;
