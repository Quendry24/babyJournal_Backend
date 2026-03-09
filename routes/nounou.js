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
    .catch((error) => console.log(error));
});

//inscription
router.post("/signUp", function (req, res) {
  console.log("Route signUp ok");
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
        const hash = bcrypt.hashSync(req.body.password, 10);
        // création nouveau utilisateur
        const newNounou = new Nounou({
          email: req.body.email,
          password: hash,
          token: uid2(32),
        });
        console.log(newNounou);

        newNounou.save().then((newNounou) => {
          console.log(newNounou.token);
          res.json({ result: true, token: newNounou.token });
        });
      } else {
        res.json({ result: false, error: " already exists" });
      }
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

module.exports = router;
