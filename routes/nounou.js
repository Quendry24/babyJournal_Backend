var express = require("express");
var router = express.Router();

require("../models/connection");
const mongoose = require("mongoose");

const Nounou = require("../models/Nounou.js");
const Parent = require("../models/Parent");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const { checkBody } = require("../modules/checkbody.js");
/* GET home page. */
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
  // Nounou.findOne({ IdNounou })
  //   .then((data) => {
  //     if (!data) {
  //       return res.json({ result: false });
  //     }
  //     const jour = data.Calendrier.find((e) => e.Date_Du_Jour === today);
  //     console.log(data);
  //     const child = jour.Enfants;
  //     res.json({ result: true, child });
  //   })
  //   .catch((error) => console.log(error));
});

//inscription
router.post("/signUp", function (req, res) {
  console.log("Route nounou signUp ok");
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Nounou.findOne({ email: req.body.email })
    .then((dataNounou) => {
      if (dataNounou === null) {
        res.json({ result: false, error: "Nounou already exists" });
        return;
      }
      const hash = bcrypt.hashSync(req.body.password, 10);

      const IdNounou = uid2(10);
      // création nouveau utilisateur
      const newNounou = new Nounou({
        email: req.body.email,
        password: hash,
        IdNounou: IdNounou,
        token: uid2(32),
      });
      console.log(newNounou);

      newNounou.save().then((newNounou) => {
        console.log(newNounou.token);
        res.json({ result: true, token: newNounou.IdNounou });
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({ result: false, error: "database error" });
    });
});

//Connexion

router.post("/signIn", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Nounou.findOne({ email: req.body.email })
    .then((dataNounou) => {
      if (
        dataNounou &&
        bcrypt.compareSync(req.body.password, dataNounou.password)
      ) {
        res.json({ result: true, token: dataNounou.token });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: false, error: "Server error" });
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
