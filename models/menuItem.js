const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    cafe: String,
    fixed: { type: Boolean, default: false }
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
