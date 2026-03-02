const mongoose = require("mongoose");

const familleSchema = mongoose.Schema({
  Nom: String,
  familyId: String,
  Enfants: [{ Type: mongoose.Schema.Types.ObjectId, ref: "IdEnfant" }],
  Parent: [{ Type: mongoose.Schema.Types.ObjectId, ref: "idParent" }],
});

const Famille = mongoose.model("famille", familleSchema);

module.exports = Famille;
