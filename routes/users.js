// External libs
var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
var HttpStatus = require('http-status-codes');

// Models
var User = require(appRoot + '/models/user');
var Response = require(appRoot + '/models/response');
var Error = require(appRoot + '/models/error');

/* Get all users */
router.get('/', function(req, res) {
  User.find({}, function (err, users) {
    if (err) {
      return res.status(HttpStatus.NOT_FOUND)
        .json(new Response(null, new Error(1, 'User not found', '', null), null));
    } else {
      res.status(HttpStatus.OK).json(new Response(users));
    }
  });
});

/* Get user by id */
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(new Response(null, new Error(1, 'User not found', '', null), null));
    }
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND)
        .json(new Response(null, new Error(1, 'User not found', '', null), null));
    }
    res.status(HttpStatus.OK).json(new Response(user));
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
        .json(new Response(null, new Error(2, 'Failed to add user to database', '', null), null));
    } else {
      res.status(HttpStatus.OK).json(new Response(user));
    }
  });
});

/* Delete user by id */
router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(new Response(null, new Error(3, 'Failed to delete user from database', '', null), null));
      } else {
        res.status(HttpStatus.OK).end();
      }
  });
});

/* Update user by id */
router.put('/:id', function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(new Response(null, new Error(4, 'Failed to update user on database', '', null), null));
      } else {
        res.status(HttpStatus.OK).json(new Response(user));
      }
  });
});

module.exports = router;
