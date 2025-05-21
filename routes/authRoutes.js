const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Felaktig e-post");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Felaktigt lösenord");

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
