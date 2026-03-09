var express = require("express");
var router = express.Router();
const Nounou = require("../models/Nounou.js");
const Enfant = require("../models/Enfant.js");

router.post("/calendrier/semaine/:IdNounou", (req, res) => {
  const { date, allChild } = req.body;
  const { IdNounou } = req.params;
  let planningSemaine = [];
  let semaine = [];
  let enfantsSemaine = [];

  const monday = date;
  for (let i = 0; i < 7; i++) {
    let enfantsJour = [];
    let newDay = new Date(monday);
    newDay.setDate(newDay.getDate() + i);
    const formattedDate = newDay.toISOString().split("T")[0];

    semaine.push(formattedDate);

    allChild.map((data) => {
      data.presence[i] &&
        enfantsJour.push({ idbabyJournal: data.idBabyJournal, Nom: data.name });
    });
    enfantsSemaine.push({ [formattedDate]: enfantsJour });

    planningSemaine.push({
      Date_Du_Jour: formattedDate,
      Enfants: enfantsJour,
      Début_vacances: date.split("T")[0],
      Fin_Vacances: date.split("T")[0],
    });
  }

  Nounou.updateOne(
    { IdNounou },
    {
      $pull: {
        Calendrier: { Date_Du_Jour: { $in: semaine } },
      },
    },
    { upsert: true },
  )
    .then(() => {
      return Nounou.updateOne(
        { IdNounou },
        {
          $setOnInsert: { IdNounou },
          $push: { Calendrier: { $each: planningSemaine } },
        },
        { upsert: true },
      );
    })
    .then(() => {
      res.json({ result: true, planningSemaine });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ result: false });
    });
});

router.get("/calendrier/jour/:IdNounou", (req, res) => {
  const { IdNounou } = req.params;
  const today = new Date();
  Nounou.findOne({ IdNounou }).then((data) => {
    console.log(data);
    const enfantsDuJour = data.Calendrier.filter(
      (e) => e.Date_Du_Jour === today,
    );
    console.log("edj", enfantsDuJour);

    res.json({ result: true, enfantsDuJour });
  });
});

// router.post("/calendrier/jour/:IdNounou", (req, res) => {
//   const { today } = req.body;
//   const { IdNounou } = req.params;
//   Nounou.findOne({ IdNounou })
//     .then((data) => {
//       if (!data) {
//         return res.json({ result: false });
//       }
//       const jour = data.Calendrier.find((e) => e.Date_Du_Jour === today);
//       const child = jour.Enfants;
//       res.json({ result: true, child });
//     })
//     .catch((err) => console.log(err));
// });

router.get("/enfants/:idNounou", (req, res) => {
  const { idNounou } = req.params;
  Enfant.find({ Nounou: idNounou }).then((data) => {
    res.json({ result: true, childs: data });
  });
});

module.exports = router;
