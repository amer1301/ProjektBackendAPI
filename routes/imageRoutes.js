const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:imageName', async (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, '..', 'images', imageName);
  console.log("Försöker hämta bild från:", imagePath);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).send('Bild hittades inte');
  }

  const ext = path.extname(imageName).toLowerCase();

  try {
    const webpBuffer = await sharp(imagePath)
      .webp({ quality: 90 })
      .toBuffer();

    res.set('Content-Type', 'image/webp');
    res.send(webpBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fel vid bildbehandling');
  }
});

module.exports = router;
