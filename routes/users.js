// External libs
var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
var HttpStatus = require('http-status-codes');

// Models
var User = require(appRoot + '/models/user');

// Transport
var Response = require(appRoot + '/transport/response');
var Error = require(appRoot + '/transport/error');

/* Get all users */
router.get('/', function(req, res) {
  User.find({}, function (err, users) {
    if (err) {
      return res.status(HttpStatus.NOT_FOUND)
        .json(Response.error(new Error(1, 'Internal server error', err)));
    } else {
      res.status(HttpStatus.OK).json(Response.success(users));
    }
  });
});

/* Get user by id */
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(Response.error(new Error(1, 'Internal server error', err)));
    }
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND)
        .json(Response.error(new Error(2, 'User not found')));
    }
    res.status(HttpStatus.OK).json(Response.success(user));
  });
});

/* Create user */
router.post('/', function (req, res) {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }, function (err, user) {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(Response.error(new Error(3, 'Failed to add user to database', err)));
    } else {
      res.status(HttpStatus.OK).json(Response.success(user));
    }
  });
});

/* Update user by id */
router.put('/:id', function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(Response.error(new Error(4, 'Failed to update user on database', err)));
      } else {
        res.status(HttpStatus.OK).json(Response.success(user));
      }
  });
});

/* Delete user by id */
router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(Response.error(new Error(5, 'Failed to delete user from database', err)));
      } else {
        res.status(HttpStatus.OK).json(Response.success());
      }
  });
});

module.exports = router;
