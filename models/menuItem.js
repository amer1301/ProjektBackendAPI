const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
