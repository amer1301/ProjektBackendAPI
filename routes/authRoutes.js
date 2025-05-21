const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Registrering
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Användarnamn och lösenord är obligatoriska.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Användarnamnet är redan taget.' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Användare skapad!' });
  } catch (error) {
    res.status(500).json({ error: 'Fel vid skapande av användare' });
  }
});

// Inloggning
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Felaktigt användarnamn" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Felaktigt lösenord" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Serverfel vid inloggning" });
  }
});

router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Du har åtkomst till denna skyddade route",
    userId: req.user.id,
  });
});

module.exports = router;
