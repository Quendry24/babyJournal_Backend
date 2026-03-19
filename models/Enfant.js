const mongoose = require("mongoose");

const adressSchema = mongoose.Schema({
  Rue: String,
  Ville: String,
  Code_Postal: String,
});

const contactSchema = mongoose.Schema({
  nom: String,
  numero: Number,
});

const documentsSchema = mongoose.Schema({
  url: String,
  Date_de_creation: Date,
});

const enfantSchema = mongoose.Schema({
  idBabyJournal: String,
  Nounou: String, // pas object id car c'est la nounou qui crée l'enfant
  // Famille: [{ type: mongoose.Schema.Types.ObjectId, ref: "famille" }],
  Famille: [String],
  Nom: String,
  Prenom: String,
  Poids: Number,
  Birthday: Date,
  Adresse: [adressSchema],
  Contacts: contactSchema,
  Allergies: [String],
  Vaccins: [String],
  Documents: [documentsSchema],
});

const Enfant = mongoose.model("enfant", enfantSchema);

module.exports = Enfant;
