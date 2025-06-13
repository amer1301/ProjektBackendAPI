const express = require('express'); 
const router = express.Router();
const MenuItem = require('../models/menuItem');

// Hämta alla menyobjekt (t.ex. för admin)
router.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    console.error('Fel vid hämtning av alla menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid hämtning av menyobjekt' });
  }
});

// Hämta menyobjekt via ID
router.get('/menu-items/item/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menyobjekt hittades inte' });
    }
    res.json(item);
  } catch (error) {
    console.error('Fel vid hämtning av menyobjekt via ID:', error);
    res.status(500).json({ error: 'Fel vid hämtning av menyobjekt via ID' });
  }
});


// Hämta meny för ett specifikt kafé, inkl fastlåsta
router.get('/menu-items/by-cafe/:cafe', async (req, res) => {
  try {
    const cafe = req.params.cafe;
    const menuItems = await MenuItem.find({
      $or: [
        { fixed: true },
        { cafe: { $regex: new RegExp(`^${cafe}$`, 'i') } }
      ]
    });
    res.json(menuItems);
  } catch (error) {
    console.error('Fel vid hämtning av meny för kafé:', error);
    res.status(500).json({ error: 'Fel vid hämtning av meny för kafé' });
  }
});

// POST för nytt menyobjekt
router.post('/menu-items', async (req, res) => {
  try {
    const { name, price, category, cafe, fixed } = req.body;
    const newMenuItem = new MenuItem({ name, price, category, cafe, fixed });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Fel vid skapande av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid skapande av menyobjekt' });
  }
});

// PUT - Uppdatera menyobjekt
router.put('/menu-items/:id', async (req, res) => {
  console.log("PUT /menu-items/:id anropad med id:", req.params.id);
  try {
    const { name, price, category, cafe } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, category, cafe },
      { new: true } // returnera det uppdaterade dokumentet
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Bakverk hittades inte' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Fel vid uppdatering av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid uppdatering av menyobjekt' });
  }
});


// DELETE med skydd för fastlåsta
router.delete('/menu-items/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ error: 'Menyobjekt hittades inte' });
    if (menuItem.fixed) return res.status(403).json({ error: 'Det här bakverket är fastlåst och kan inte tas bort' });
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menyobjekt borttaget' });
  } catch (error) {
    console.error('Fel vid borttagning av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid borttagning av menyobjekt' });
  }
});

module.exports = router;
