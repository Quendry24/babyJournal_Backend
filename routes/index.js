var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//météo
router.get("/meteo", function (req, res) {
  const { lat, lon } = req.query;

  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.API_WEATHER}&q=${lat},${lon}&lang=fr`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.forecast) {
        return res.json({ result: false, error: "Pas de données météo", data });
      }

      const hours = data.forecast.forecastday[0].hour;
      const huitH = hours[9];
      const onzeH = hours[11];
      const quatorzeH = hours[14];
      const dixSeptH = hours[17];

      res.json({ result: true, huitH, onzeH, quatorzeH, dixSeptH });
    })
    .catch((err) => {
      console.error("Erreur météo:", err);
      res.status(500).json({ result: false, error: "Erreur serveur" });
    });
});

module.exports = router;
