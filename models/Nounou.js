const mongoose = require("mongoose");

const heuresEnfantSchema = mongoose.Schema({
  Enfants: [{ Type: mongoose.Schema.Types.ObjectId, ref: "IdEnfant" }],
  Heures_arrivée: Date,
  Heures_départ: Date,
});
const calendrierSchema = mongoose.Schema({
  Date_Du_Jour: Date,
  Enfants: [{ Type: mongoose.Schema.Types.ObjectId, ref: "IdEnfant" }],
  Début_vacances: Date,
  Fin_Vacances: Date,
  heuresEnfant: heuresEnfantSchema,
});

const adressSchema = mongoose.Schema({
  rue: String,
  ville: String,
  Pays: String,
});
const nounouSchema = mongoose.Schema({
  Email: String,
  Password: String,
  IdNounou: String,
  Calendrier: calendrierSchema,
  Famille: [{ Type: mongoose.Schema.Types.ObjectId, ref: "famille" }],
  Nom: String,
  Prénom: String,
  Adresse: adressSchema,
  Contact: Number,
  PajeEmploi: String,
  Agrement: Number,
});
const Nounou = mongoose.model("nounou", nounouSchema);

module.exports = Nounou;
