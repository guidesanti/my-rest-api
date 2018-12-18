/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var appRoot = require('app-root-path');
var mongoose = require('mongoose');
var winston = require('winston');

// Configuration
var config = require(`${appRoot}/config/config`).getAppConfig();
var winstonConfig = require(appRoot + '/config/config').getWinstonConfig();

// The routers
var indexRouter = require(appRoot + '/routes/index');
var authRouter = require(appRoot + '/routes/auth');
var usersRouter = require(appRoot + '/routes/users');

var app = express();

/**
 * Logger setup.
 */
setupLogger();
const logger = winston.loggers.get('app-logger');
logger.error('Testing ...');
logger.warn('Testing ...');
logger.info('Testing ...');
logger.verbose('Testing ...');
logger.debug('Testing ...');
logger.silly('Testing ...');

/**
 * Database setup.
 */
logger.debug('Setting up the database ...');
setupDB();

// Application middlewares
logger.debug('Setting up the application middlewares ...');
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup non protected routes
logger.debug('Setting up the application routes ...');
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Setup protected routes
app.use('/', function (req, res, next) {
    console.log('Middleware in action');
    next();
});
app.use('/users', usersRouter);

/**
 * Setup the logger.
 */
function setupLogger() {
  const format = winston.format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });
  winstonConfig.console.format = winston.format.combine(winston.format.splat(), winston.format.colorize(),
    winston.format.label({ label: 'My REST API' }), winston.format.timestamp(), format);
  winstonConfig.error.format = winston.format.combine(winston.format.splat(),
    winston.format.label({ label: 'My REST API' }), winston.format.json());
  winstonConfig.full.format = winston.format.combine(winston.format.splat(),
    winston.format.label({ label: 'My REST API' }), winston.format.json());

  winston.loggers.add('app-logger', {
    level: 'silly',
    exitOnError: false,
    transports: [
      new winston.transports.Console(winstonConfig.console),
      new winston.transports.File(winstonConfig.error),
      new winston.transports.File(winstonConfig.full),
    ],
    exceptionHandlers: [
      new winston.transports.File(winstonConfig.exception)
    ]
  });
}

/**
 * Setup database.
 */
function setupDB() {
  var mongoConnectionString = 'mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db;
  console.info('Mongo connection string: ' + mongoConnectionString);
  mongoose.connect(mongoConnectionString, { useNewUrlParser: true }).then(function () {
    logger.debug('Successfully connected to MongoDB');
  }, function (err) {
    logger.error('Failed to connect to MongoDB: %j', err);
  });
}

module.exports = app;
