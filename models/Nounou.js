const mongoose = require("mongoose");

// const heuresEnfantSchema = mongoose.Schema({
//   Enfants: [{ type: mongoose.Schema.Types.ObjectId, ref: "enfant" }],
//   Heures_arrivée: Date,
//   Heures_départ: Date,
// });

const todayEnfantSchema = mongoose.Schema({
  idBabyJournal: String,
  Prenom: String,
  Heures_arrivée: String,
  Heures_départ: String,
});

const calendrierSchema = mongoose.Schema({
  Date_Du_Jour: String,
  Enfants: [todayEnfantSchema],
  Début_vacances: Date,
  Fin_Vacances: Date,
  // heuresEnfant: heuresEnfantSchema,
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
  Calendrier: [calendrierSchema],
  Famille: [{ type: mongoose.Schema.Types.ObjectId, ref: "famille" }],
  Nom: String,
  Prénom: String,
  Adresse: adressSchema,
  Contact: Number,
  PajeEmploi: String,
  Agrement: Number,
});
const Nounou = mongoose.model("nounou", nounouSchema);

module.exports = Nounou;
