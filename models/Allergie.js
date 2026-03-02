const mongoose = require("mongoose");

const allergiesSchema = mongoose.Schema({
  Nom: [String],
});
const Allergie = mongoose.model("allergies", allergiesSchema);

module.exports = Allergie;
