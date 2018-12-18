// External libs
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var appRoot = require('app-root-path');
var HttpStatus = require('http-status-codes');

// Config
var config = require(appRoot + '/config/config').getAppConfig();

// Services
var AuthService = require(appRoot + '/services/auth-service');

// Models
var User = require(appRoot + '/models/user');

// Transport
var Response = require(appRoot + '/transport/response');
var Error = require(appRoot + '/transport/error');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Sing Up
router.post('/signup', function (req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  }, function (err, user) {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(new Response(null, new Error(1, 'Failed to create user on databse', err, null), null));
    }

    // Create a token
    var token = jwt.sign({ id: user._id }, config.jwtSecretKey, {
      expiresIn: 86400
    });

    res.status(HttpStatus.OK).json(new Response({ auth: true, token: token }));
  });
});

// Login
router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(new Response(null, new Error(2, 'Failed to get user from database', err)));
    }

    // Check user
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND)
        .json(new Response(null, new Error(3, 'User not found')));
    }
    
    // Check user password
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(HttpStatus.UNAUTHORIZED)
        .json(new Response(null, new Error(4, 'Authentiction failed', 'Invalid password', { auth: false, token: null })));
    }

    // Create a token
    var token = jwt.sign({ id: user._id }, config.jwtSecretKey, {
      expiresIn: 86400
    });

    res.status(HttpStatus.OK).json(new Response({ auth: true, token: token }));
  });
});

// Logout
router.get('/logout', function(req, res) {
  res.status(HttpStatus.OK).json(new Response({ auth: false, token: null }));
});

// Me
router.get('/me', AuthService.verifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });
});

module.exports = router;
