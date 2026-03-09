const mongoose = require("mongoose");

const adressSchema = mongoose.Schema({
  Rue: String,
  Ville: String,
  Pays: String,
});

const contatctsSchema = mongoose.Schema({
  pediatre: Number,
});

const documentsSchema = mongoose.Schema({
  type: String,
  idDoc: String,
  url: String,
  Date_de_creation: Date,
});

const enfantSchema = mongoose.Schema({
  idBabyJournal: String,
  Nounou: String, // pas object id car c'est la nounou qui crée l'enfant
  Famille: [{ type: mongoose.Schema.Types.ObjectId, ref: "famille" }],
  Nom: String,
  Prenom: String,
  Poids: Number,
  Birthday: Date,
  Adresse: [adressSchema],
  Contacts: contatctsSchema,
  Allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: "allergies" }],
  Vaccins: [{ type: mongoose.Schema.Types.ObjectId, ref: "vaccins" }],
  Documents: [documentsSchema],
});

const Enfant = mongoose.model("enfant", enfantSchema);

module.exports = Enfant;
