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

// Importera modellen
const MenuItem = require('./models/menuItem');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Funktion för att lägga in fastlåsta bakverk
async function seedFixedItems() {
  const fixedItems = [
    { name: 'Macaroons', price: 25, category: 'kaka', fixed: true },
    { name: 'Nutellakakor', price: 15, category: 'kaka', fixed: true },
    { name: 'Chocolate Chip Cookies', price: 20, category: 'kaka', fixed: true },
    { name: 'Cakesicles', price: 35, category: 'bakelse', fixed: true },
    { name: 'Cupcakes', price: 20, category: 'bakelse', fixed: true },
    { name: 'Hallongrottor', price: 10, category: 'kaka', fixed: true }
  ];

  for (const item of fixedItems) {
    const exists = await MenuItem.findOne({ name: item.name, fixed: true });
    if (!exists) {
      await new MenuItem(item).save();
      console.log(`La till fastlåst bakverk: ${item.name}`);
    } else {
      console.log(`${item.name} finns redan som fastlåst.`);
    }
  }
}

// Anslut till MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Kör seed-funktionen när databasen är ansluten
    seedFixedItems().catch(err => console.error("Fel vid seedning av fastlåsta bakverk:", err));
  })
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
