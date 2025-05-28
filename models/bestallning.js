const mongoose = require('mongoose');

const bestallningSchema = new mongoose.Schema({
  namn: String,
  telefon: String,
  email: String,
  bakverk: String,
  antal: String,
  meddelande: String,
  upphamtning: String,
  skapad: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bestallning', bestallningSchema, 'bestallningar');

