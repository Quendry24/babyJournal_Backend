var express = require("express");
var router = express.Router();

require("../models/connection");

const mongoose = require("mongoose");
const Parent = require("../models/Parent");
const Nounou = require("../models/Nounou.js");
const Famille = require("../models/Famille.js");

const uid2 = require("uid2");
//Installer yarn add uid2

const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkbody");

//inscription
router.post("/signUp", async (req, res) => {
  try {
    console.log("route parent signUP ok", req.body);

    const email = req.body.email;
    const password = req.body.password;

    if (!checkBody(req.body, ["email", "password"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
    const parent = await Parent.findOne({ email });
    if (parent !== null) {
      res.json({ result: false, error: "Parent already exists" });
      return;
    }
    const hash = bcrypt.hashSync(password, 10);

    const familyId = uid2(10);

    const newFamily = new Famille({
      Nom: "123",
      familyId: familyId,
    });
    const family = await newFamily.save();

    const newParent = new Parent({
      email: req.body.email,
      password: hash,
      Nom: req.body.Nom,
      Famille: familyId,
    });

    await newParent.save();

    family.Parent.push(newParent._id);
    await family.save();
    res.json({
      result: true,
      familyId,
      idUser: newParent._id,
    });
  } catch (error) {}
});

//   Parent.findOne({ email: req.body.email }).then((dataParent) => {
//     if (dataParent !== null) {
//       res.json({ result: false, error: "Parent already exists" });
//       return;
//     }

//     const hash = bcrypt.hashSync(req.body.password, 10);

//     const familyId = uid2(10);

//     const newFamily = new Famille({
//       Nom: "123",
//       familyId: familyId,
//     });

//     console.log("familyId généré :", familyId);
//     newFamily.save().then(() => {
//       console.log("nf", newFamily);
//       const newParent = new Parent({
//         email: req.body.email,
//         password: hash,
//         Nom: req.body.Nom,
//         Famille: familyId,
//       });

//       console.log(newParent);

//       newParent
//         .save()
//         .then((newParent) => {
//           console.log(newParent.familyId);

//         })
//         .then(() => {
//           Famille.updateOne({ familyId }, { Parent: idUser });
//         });
//     });
//   });

//Connexion
router.post("/signIn", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Parent.findOne({ email: req.body.email })
    .then((dataParent) => {
      if (
        dataParent &&
        bcrypt.compareSync(req.body.password, dataParent.password)
      ) {
        res.json({ result: true, token: dataParent.token });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: false, error: "Server error" });
    });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/allParents", (req, res) => {
  Parent.find().then((data) => {
    res.json(data);
  });
});

router.put("/updateInfos/", (req, res) => {
  Parent.updateOne({
    Prenom: req.body.prenom,
    Birthday: req.body.birthday,
    Adresse: req.body.adresse,
    PajeEmploi: req.body.pajemploi,
    Agrement: req.body.agrement,
  }).then(() => {
    res.json({ result: true });
  });
});
module.exports = router;
