const mongoose = require("mongoose");

const contactsSchema = mongoose.Schema({
  parent: Number,
});
const parentSchema = mongoose.Schema({
  email: String,
  password: String,
  token: String,
  // idParent: String, = token (melissa)
  Famille: [String],
  // Famille: { type: mongoose.Schema.Types.ObjectId, ref: "famille" },
  Nom: String,
  Prenom: String,
  Role: String,
  Birthday: Date,
  Adresse: String,
  Contacts: [contactsSchema],
  PajeEmploi: String,
  Agrément: Number,
});

const Parent = mongoose.model("parent", parentSchema);

module.exports = Parent;
