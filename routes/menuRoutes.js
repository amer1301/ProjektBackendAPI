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
    const { name, price, category } = req.body;
    const newMenuItem = new MenuItem({
      name,
      price,
      category
    });
    await newMenuItem.save();  // Spara menyobjektet i databasen
    res.status(201).json(newMenuItem);  // Skicka tillbaka det nyskapade menyobjektet
  } catch (error) {
    console.error('Fel vid skapande av menyobjekt:', error);
    res.status(500).json({ error: 'Fel vid skapande av menyobjekt' });
  }
});

module.exports = router;
