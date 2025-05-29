const express = require('express');
const router = express.Router();
const Bestallning = require('../models/bestallning');

// POST - Lägg till ny beställning
router.post('/', async (req, res) => {
  try {
    const nyBestallning = new Bestallning(req.body);
    await nyBestallning.save();
    res.status(201).json({ message: "Beställning mottagen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Hämta alla beställningar
router.get('/', async (req, res) => {
  try {
    const bestallningar = await Bestallning.find().sort({ skapad: -1 });
    res.json(bestallningar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Ta bort en beställning med ett specifikt ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Bestallning.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Beställning hittades inte" });
    }
    res.json({ message: "Beställning borttagen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Uppdatera status för en beställning
router.put('/:id', async (req, res) => {
  try {
    const uppdaterad = await Bestallning.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!uppdaterad) {
      return res.status(404).json({ message: 'Beställning hittades inte' });
    }

    res.json({ message: 'Status uppdaterad', bestallning: uppdaterad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
