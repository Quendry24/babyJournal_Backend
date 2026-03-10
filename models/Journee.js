const mongoose = require("mongoose");

const repasSchema = mongoose.Schema({
  heure: String,
  humeur: String,
  biberon: String,
  commentaire: String,
});

const siestesSchema = mongoose.Schema({
  couche: String,
  reveil: String,
  humeur: String,
  commentaire: String,
});

const changesSchema = mongoose.Schema({
  heure: String,
  types: [String],
  commentaire: String,
});

const santeSchema = mongoose.Schema({
  heure: String,
  symptomes: String,
  traitements: String,
  temperature: String,
  commentaire: String,
});

const activitesSchema = mongoose.Schema({
  nom: String,
  humeur: String,
  commentaire: String,
  photos: [String],
});

const notesSchema = mongoose.Schema({
  nom: String,
  commentaire: String,
});

const journeeSchema = mongoose.Schema({
  Date: Date,
  idBabyJournal: String,
  Repas: [repasSchema],
  Siestes: [siestesSchema],
  Changes: [changesSchema],
  Sante: [santeSchema],
  Activites: [activitesSchema],
  Notes: [notesSchema],
});

const Journee = mongoose.model("journee", journeeSchema);

module.exports = Journee;
