var express = require("express");
var router = express.Router();

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
  console.log(monday);
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
    const enfantsDuJour = data?.Calendrier.find(
      (e) => e.Date_Du_Jour === today.toISOString().split("T")[0],
    );

    res.json({ result: true, enfantsDuJour: enfantsDuJour?.Enfants || [] });
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

  Nounou.findOne({ email })
    .then((dataNounou) => {
      if (dataNounou !== null) {
        res.json({ result: false, error: "compte déjà existant" });
        return;
      }
      const hash = bcrypt.hashSync(password, 10);

      const IdNounou = uid2(10);
      // création nouveau utilisateur
      const newNounou = new Nounou({
        email: req.body.email,
        password: hash,
        IdNounou,
      });

      newNounou.save().then(() => {
        console.log(newNounou);
        res.json({
          result: true,
          email: newNounou.email,
          idNounou: newNounou.IdNounou,
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ result: false, error });
    });
});

//update infos
router.put("/updateInfos/:idNounou", (req, res) => {
  const infos = {
    Nom: req.body.nom,
    Prenom: req.body.prenom,
    Agrement: req.body.agrement, // coté nounou
    Birthday: req.body.date,
    Adresse: req.body.adresse,
    Pajemploi: req.body.pajemploi,
  };

  console.log("idNounou reçu? :", req.params.idNounou);
  Nounou.updateOne(
    { IdNounou: req.params.idNounou },

    {
      infos,
      $addToSet: { Contact: req.body.contact }, //addToSet n'ajoute pas de doublon contraitrement a push
    },
    { upsert: true },
  )
    .then(() => {
      console.log(infos);
      res.json({
        result: true,
        infos,
        Contact: req.body.contact,
      });
    })
    .catch((err) => {
      res.status(500).json({ result: false, err });
    });
});

//Connexion
router.post("/signIn", (req, res) => {
  console.log("route SignIn ok");
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "champs manquants" });
    return;
  }
  Nounou.findOne({ email: req.body.email })
    .then((dataNounou) => {
      console.log("dataNounou :", dataNounou);
      if (
        dataNounou &&
        bcrypt.compareSync(req.body.password, dataNounou.password)
      ) {
        res.json({
          result: true,
          email: dataNounou.email,
          userId: dataNounou.IdNounou,
        });
      } else {
        res.status(404).json({
          result: false,
          error: "Email ou mot de passe incorrect.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ result: false, error: "Erreur" });
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
