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
  console.log("POST /api/auth/login anrop mottaget");
  console.log("Begärd body:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      console.log("⚠️ Användarnamn eller lösenord saknas i förfrågan");
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ Ingen användare hittad med användarnamn:", username);
      return res.status(400).json({ error: "Felaktigt användarnamn" });
    }

    console.log("✅ Användare hittad:", user.username);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Fel lösenord för användare:", username);
      return res.status(400).json({ error: "Felaktigt lösenord" });
    }

    console.log("Lösenord korrekt");

    // Kontrollera JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET är inte definierad i miljövariabler!");
      return res.status(500).json({ error: "Serverfel: JWT_SECRET saknas" });
    }

    console.log("🔐 JWT_SECRET finns");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log("✅ JWT-token skapad");

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("❌ Fel vid inloggning:", error.message);
    console.error("🔎 Fullständig felstack:", error);
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
