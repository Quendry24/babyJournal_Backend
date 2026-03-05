const mongoose = require("mongoose");

const contactsSchema = mongoose.Schema({
  parent: Number,
});
const parentSchema = mongoose.Schema({
  email: String,
  password: String,
  //token: String,
  idParent: String,
  Famille: { Type: mongoose.Schema.Types.ObjectId, ref: "famille" },
  Nom: String,
  Prénom: String,
  Rôle: String,
  Birthday: Date,
  Adresse: String,
  Contacts: [contactsSchema],
  PajeEmploi: String,
  Agrément: Number,
});

const Parent = mongoose.model("parent", parentSchema);

module.exports = Parent;
