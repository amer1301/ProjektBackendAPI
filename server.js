const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// ROUTES
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require("./routes/authRoutes");
const bestallningarRoutes = require("./routes/bestallningar");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Anslut till MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

// ROUTER
app.use("/api/menu", menuRoutes);
app.use("/api/bestallningar", bestallningarRoutes);
app.use("/api/auth", authRoutes);

// Bildhantering via Sharp
app.use("/images", imageRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


// TESTRUTT
app.get("/", (req, res) => {
  res.send("Välkommen till backend-servern!");
});

// STARTA SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
