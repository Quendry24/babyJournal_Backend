var express = require("express");
var router = express.Router();
const Nounou = require("../models/Nounou.js");

/* GET home page. */
router.post("/calendrier/semaine/:IdNounou", (req, res) => {
  console.log("bien reçu");
  const { date } = req.body;
  const { IdNounou } = req.params;
  let semaine = [];
  const monday = date;
  for (let i = 0; i < 7; i++) {
    let newDay = new Date(monday);
    newDay.setDate(newDay.getDate() + i);
    semaine.push({
      Date_Du_Jour: newDay.toISOString().split("T")[0],
      Enfants: [{ Nom: "Léa" }, { Nom: "Martin" }],
      Début_vacances: date.split("T")[0],
      Fin_Vacances: date.split("T")[0],
    });
  }

  Nounou.findOne({ IdNounou })
    .then((data) => {
      if (!data) {
        console.log("Nounou introuvable");
        const newWeek = new Nounou({
          IdNounou,
          Calendrier: semaine,
        });
        newWeek.save().then(() => {
          res.json({ result: true, date, IdNounou });
        });
      } else {
        console.log("Nounou existante");
        Nounou.updateOne(
          { IdNounou },
          {
            $addToSet: {
              Calendrier: { $each: semaine },
            },
          },
        ).then(() => {
          res.json({ result: true, date, IdNounou });
        });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
