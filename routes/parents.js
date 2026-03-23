var express = require("express");
var router = express.Router();

const Parent = require("../models/Parent");
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
      Nom: req.body.Nom,
      familyId: familyId,
    });
    const family = await newFamily.save();

    const newParent = new Parent({
      email: req.body.email,
      password: hash,
      Famille: familyId,
    });

    await newParent.save();
    //5RmJP6Svsq
    family.Parent.push(newParent._id);
    await family.save();
    res.json({
      result: true,
      email: req.body.email,
      familyId,
      idUser: newParent._id,
    });
  } catch (error) {
    res.status(500).json({ result: false, error });
  }
});

//inscription + rejoindre famille
router.post("/signUp/join", async (req, res) => {
  try {
    console.log("route parent signUP ok", req.body);

    const email = req.body.email;
    const password = req.body.password;

    if (!checkBody(req.body, ["email", "password", "idFamily"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
    const parent = await Parent.findOne({ email });
    if (parent !== null) {
      res.status(404).json({ result: false, error: "Parent already exists" });
      return;
    }
    const hash = bcrypt.hashSync(password, 10);

    const family = await Famille.findOne({ familyId: req.body.idFamily });

    if (!family) {
      return res.status(404).json({ result: false, error: "Family not found" });
    }

    const newParent = new Parent({
      email: req.body.email,
      password: hash,
      Famille: req.body.idFamily,
    });

    await newParent.save();

    await Famille.updateOne(
      { familyId: req.body.idFamily },
      { $addToSet: { Parent: newParent._id } },
    );

    res.json({
      result: true,
      email: req.body.email,
      familyId: req.body.idFamily,
      userId: newParent._id,
    });
  } catch (error) {
    res.status(500).json({ result: false, error });
  }
});

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
        res.json({
          result: true,
          email: dataParent.email,
          userId: dataParent._id,
        });
      } else {
        res
          .status(404)
          .json({ result: false, error: "User not found or wrong password" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ result: false, error: "Server error" });
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

router.put("/updateInfos/:idParent", (req, res) => {
  const infos = {
    Nom: req.body.nom,
    Prenom: req.body.prenom,
    Role: req.body.role,
    Birthday: req.body.date,
    Adresse: req.body.adresse,
    Pajemploi: req.body.pajemploi,
  };

  console.log("idParent reçu? :", req.params.idParent);
  console.log("famille", req.body.famille);
  Parent.updateOne(
    { idParent: req.params.idParent },

    {
      infos,
      $addToSet: { Famille: req.body.famille, Contact: req.body.contact }, //addToSet n'ajoute pas de doublon contraitrement a push
    },
    { upsert: true },
  )
    .then(() => {
      console.log(infos);
      res.json({
        result: true,
        infos,
        Famille: req.body.famille,
        Contact: req.body.contact,
      });
    })
    .catch((err) => {
      res.status(500).json({ result: false, err });
    });
});

//trouver la famille du parent à la connexion
router.get("/famille/:idParent", (req, res) => {
  const { idParent } = req.params;

  Parent.findOne({ _id: idParent })
    .then((data) => {
      res.json({ result: true, idFamille: data.Famille[0] });
    })
    .catch((err) => res.json({ result: false, err }));
});

module.exports = router;
