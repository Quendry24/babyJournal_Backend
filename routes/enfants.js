var express = require("express");
var router = express.Router();
const Enfant = require("../models/Enfant.js");
const uid2 = require("uid2");
const { checkBody } = require("../modules/checkbody.js");
const mongoose = require("mongoose");
const Journee = require("../models/Journee.js");

router.post("/add", (req, res) => {
  const { Nom, Prenom, Birthday, idNounou } = req.body;
  console.log(Nom, Prenom, idNounou, Birthday);
  if (!checkBody(req.body, ["Nom", "Prenom", "Birthday", "idNounou"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const idBabyJournal = uid2(10);
  const newChild = new Enfant({
    idBabyJournal,
    Nom,
    Prenom,
    Birthday, //stocke a -2 heure mais on remet bien avec localstring(fr) coté front
    Nounou: idNounou,
    Famille: "123",
  });

  newChild
    .save()
    .then(() => {
      res.json({ result: true, newChild });
    })
    .catch((err) => console.log(err));
});

router.get("/:idBabyJournal", (req, res) => {
  const { idBabyJournal } = req.params;
  Enfant.findOne({ idBabyJournal }).then((data) => {
    console.log("enfant trouvé", data);
    res.json({ result: true, data });
  });
});
//Route GET pour récupérer les enfants

router.get("/famille/:idFamille", (req, res) => {
  const idFamille = req.params.idFamille;
  Enfant.find({ Famille: idFamille })
    .then((enfants) => {
      res.json({ result: true, enfants });
    })
    .catch((error) => {
      res.json({ result: false, error: error.message });
    });
});

router.get("/journee/:idBabyJournal", (req, res) => {
  console.log("ID reçu", req.params.idBabyJournal);
  const { idBabyJournal } = req.params;

  let today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  Journee.findOne({ idBabyJournal, Date: formattedDate })
    .then((data) => {
      console.log("Résultat Mongo", data);
      res.json({ result: true, data });
    })
    .catch((error) => {
      res.json({ result: false, error: error.message });
    });
});
module.exports = router;
