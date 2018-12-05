var mongoose = require('mongoose');

var modelName = 'user';

var schema = new mongoose.Schema({  
  username: String,
  email: String,
  password: String
});

mongoose.model(modelName, schema);

module.exports = mongoose.model(modelName);