require("dotenv").config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
    console.log("Request body:", req.body);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("Ingen användare hittad");
      return res.status(400).json({ error: "Felaktigt användarnamn" });
    }

    console.log("Användare hittad:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Fel lösenord");
      return res.status(400).json({ error: "Felaktigt lösenord" });
    }

    console.log("Lösenord korrekt");

    // Kontrollera JWT_SECRET
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Login error:", error); // Viktigt!
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
