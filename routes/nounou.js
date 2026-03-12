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
const Journee = require("../models/Journee.js");

router.post("/calendrier/semaine/:IdNounou", (req, res) => {
  const { monday, allChild } = req.body;
  const { IdNounou } = req.params;
  let planningSemaine = [];
  let semaine = [];
  let enfantsSemaine = [];

  for (let i = 0; i < 7; i++) {
    let enfantsJour = [];
    let newDay = new Date(monday);
    newDay.setDate(newDay.getDate() + i);
    const formattedDate = newDay.toISOString().split("T")[0];

    semaine.push(formattedDate);

    allChild.map((data) => {
      data.presence[i] &&
        enfantsJour.push({
          idBabyJournal: data.idBabyJournal,
          Prenom: data.Prenom,
        });
    });
    enfantsSemaine.push({ [formattedDate]: enfantsJour });

    planningSemaine.push({
      Date_Du_Jour: formattedDate,
      Enfants: enfantsJour,
    });
  }

  Nounou.updateOne(
    { IdNounou },
    {
      $pull: {
        Calendrier: { Date_Du_Jour: { $in: semaine } },
      },
    },
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

router.get("/calendrier/semaine/:IdNounou", (req, res) => {
  const { IdNounou } = req.params;
  const { monday } = req.query;

  const semaine = [];
  for (let i = 0; i < 7; i++) {
    let newDay = new Date(monday);
    newDay.setDate(newDay.getDate() + i);
    semaine.push(newDay.toISOString().split("T")[0]);
  }

  Nounou.findOne({ IdNounou })
    .then((data) => {
      if (!data) return res.json({ result: false });
      const planning = data.Calendrier.filter((e) =>
        semaine.includes(e.Date_Du_Jour),
      );
      res.json({ result: true, planning });
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
    if (!data) {
      return res.json({ result: false, error: "Nounou introuvable" });
    }
    const enfantsDuJour = data.Calendrier.find(
      (e) => e.Date_Du_Jour === today.toISOString().split("T")[0],
    );

    res.json({ result: true, enfantsDuJour: enfantsDuJour.Enfants || [] });
  });
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

router.get("/enfants/:idNounou", (req, res) => {
  const { idNounou } = req.params;
  Enfant.find({ Nounou: idNounou }).then((data) => {
    res.json({ result: true, childs: data });
  });
});

//route pour enregistrer les items avec types dynamiques
router.post("/:type/:idBabyJournal", (req, res) => {
  const { type, idBabyJournal } = req.params;
  let newDay = new Date();
  const formattedDate = newDay.toISOString().split("T")[0];

  Journee.updateOne(
    { idBabyJournal, Date: formattedDate },
    { $push: { [type]: req.body } },
    { upsert: true },
  )
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => res.json({ result: false, err }));
});

router.post("/commonActivity", (req, res) => {
  const { ids, nom, commentaire } = req.body;
  let newDay = new Date();
  const formattedDate = newDay.toISOString().split("T")[0];
  const promises = ids.map((data, i) =>
    Journee.updateOne(
      { idBabyJournal: data, Date: formattedDate },
      { $push: { Activites: { nom, commentaire } } },
      { upsert: true },
    ),
  );

  Promise.all(promises)
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => res.status(500).json({ result: false, err }));
});

module.exports = router;
