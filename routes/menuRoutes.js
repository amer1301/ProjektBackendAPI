const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem");
const auth = require("../middleware/authMiddleware");

// Hämta alla
router.get("/", async (req, res) => {
    const items = await MenuItem.find();
    res.json(items);
});

// Skapa ny
router.post("/", auth, async (req, res) => {
    const item = new MenuItem(req.body);
    await item.save();
    res.json(item);
});

// Uppdatera
router.put("/:id", auth, async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
});

// Radera
router.delete("/:id", auth, async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: "Raderad" });
});

module.exports = router;
