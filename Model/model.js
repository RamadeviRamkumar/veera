const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
    unique: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  eventData: {
    type: Object 
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
