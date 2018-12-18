// External libs
var appRoot = require('app-root-path');
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');

// Config
var config = require(appRoot + '/config/config').getAppConfig();

// Transport
var Response = require(appRoot + '/transport/response');
var Error = require(appRoot + '/transport/error');

var authService = {

  verifyToken(req, res, next) {
    // Get access token from header
    var token = req.headers['x-access-token'];
    if (!token) {
      return res.status(HttpStatus.FORBIDDEN)
        .json(new Response(null, new Error(0, 'Token not provided')));
    }

    // Verify the token
    jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(new Response(null, new Error(1, 'Failed to verify token', err)));
      }

      req.userId = decoded.id;
      next();
    });
  }

}

module.exports = authService;
