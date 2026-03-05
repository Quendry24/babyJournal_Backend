var express = require("express");
var router = express.Router();

require("../models/connection");

const mongoose = require("mongoose");
const Parent = require("../models/Parent");

const uid2 = require("uid2");
const token = uid2(32);
//Installer yarn add uid2

const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkbody");

const dataParent = {
  email: "test@test.fr",
  password: "test",
};
//inscription
router.post("/signUp", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Parent.findOne({ email: req.body.email }).then((dataParent) => {
    if (dataParent === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      //création nouveau utilisateur
      const newParent = new Parent({
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });
      console.log(newParent);

      newParent.save().then((newParent) => {
        console.log(newParent.token);
        res.json({ result: true, token: newParent.token });
      });
    } else {
      res.json({ result: false, error: "Parent already exists" });
    }
  });
});

router.post("/signIn", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Parent.findOne({ email: req.body.email }).then((Dataparent) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "Parent not found or wrong password" });
    }
  });
});

// router.post("/SignUp",async(req,res)=>{

// };)

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
