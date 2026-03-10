var express = require("express");
var router = express.Router();

const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.photoFromFront) {
      return res
        .status(400)
        .json({ result: false, error: "Pas de fichier reçu" });
    }
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const photoPath = path.join(tmpDir, `${uniqid()}.jpg`);
    await req.files.photoFromFront.mv(photoPath);

    console.log("Fichier reçu :", req.files.photoFromFront);

    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } catch (err) {
    console.log("Erreur upload :", err);
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
