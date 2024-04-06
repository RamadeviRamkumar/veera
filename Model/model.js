// models/Token.js

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  isAuthenticated: { type: Boolean, required: true, default: false }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
