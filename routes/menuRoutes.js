const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');

router.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();  // Hämta alla menyobjekt från databasen
    res.json(menuItems);  // Skicka tillbaka menyobjekten som JSON
  } catch (error) {
    console.error('Fel vid hämtning av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid hämtning av menyobjekt' });
  }
});

// POST-rutt för att lägga till ett nytt menyobjekt
router.post('/menu-items', async (req, res) => {
  try {
    const { name, price, category, cafe } = req.body;
    const newMenuItem = new MenuItem({
      name,
      price,
      category,
      cafe
    });
    await newMenuItem.save();  // Spara menyobjektet i databasen
    res.status(201).json(newMenuItem);  // Skicka tillbaka det nyskapade menyobjektet
  } catch (error) {
    console.error('Fel vid skapande av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid skapande av menyobjekt' });
  }
});

// Hämta meny för ett specifikt kafé
router.get('/menu-items/:cafe', async (req, res) => {
  try {
    const cafe = req.params.cafe;

    // Använd regex, case insensitive, för att hitta cafe oavsett stora/små bokstäver
    const menuItems = await MenuItem.find({
      cafe: { $regex: new RegExp(`^${cafe}$`, 'i') }
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Fel vid hämtning av meny för kafé:', error);
    res.status(500).json({ error: 'Fel vid hämtning av meny för kafé' });
  }
});

// DELETE-rutt för att ta bort ett menyobjekt
router.delete('/menu-items/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Menyobjekt hittades inte' });
    }
    res.json({ message: 'Menyobjekt borttaget' });
  } catch (error) {
    console.error('Fel vid borttagning av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid borttagning av menyobjekt' });
  }
});


module.exports = router;
