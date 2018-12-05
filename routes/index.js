var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');
var package = require('../package.json');
var config = require('../config/config.js').getAppConfig();

router.get('/', function(req, res, next) {
  res.json({ data: 'This is my rest api' });
});

router.get('/health', function (req, res, next) {
  res.status(HttpStatus.OK);
  res.json({status: "Running", version: package.version});
});

router.get('/health/version', function(req, res, next) {
  res.status(HttpStatus.OK);
  res.json({ version: package.version });
  res.end();
});

router.get('/config', function(req, res, next) {
  res.status(HttpStatus.OK);
  res.json(config);
  res.end();
});

module.exports = router;
