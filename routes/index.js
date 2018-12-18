var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');
var appRoot = require('app-root-path');

var package = require(appRoot + '/package.json');
var config = require(appRoot + '/config/config.js').getAppConfig();
var Response = require(appRoot + '/transport/response');

router.get('/', function(req, res, next) {
  res.status(HttpStatus.OK);
  res.json(Response.success({ message: 'This is my rest api' }));
});

router.get('/health', function (req, res, next) {
  res.status(HttpStatus.OK);
  res.json(Response.success({ status: 'Running', version: package.version }));
});

router.get('/health/version', function(req, res, next) {
  res.status(HttpStatus.OK);
  res.json(Response.success({ version: package.version }));
});

router.get('/config', function(req, res, next) {
  res.status(HttpStatus.OK);
  res.json(Response.success(config));
});

module.exports = router;
