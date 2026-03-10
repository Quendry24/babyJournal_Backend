const mongoose = require("mongoose");

const familleSchema = mongoose.Schema({
  Nom: String,
  familyId: String,
  //modification de "Type" en "type"
  Enfants: [String],
  Parent: [String],
});

const Famille = mongoose.model("famille", familleSchema);

module.exports = Famille;
