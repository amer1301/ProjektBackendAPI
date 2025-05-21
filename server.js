const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Importera routerna här
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Anslut till MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Grundläggande rout för att testa servern
app.get("/", (req, res) => {
  res.send("Välkommen till backend-servern!");
});

// Använd menyrutterna
app.use('/api/menu', menuRoutes);  // Alla menyrutter är nu tillgängliga under "/api/menu"

// Använd autentiseringrutter
app.use("/api/auth", authRoutes);  // Alla autentiseringsrutter är nu tillgängliga under "/api/auth"

// Starta servern
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
