const mongoose = require('mongoose');

const laborSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  pincode: { type: String, required: true }, // Adjust validations according to your requirements
  address: { type: String, required: true },
  skills: [{ type: String ,required: true}],
  experience:{
    type: String, required: true
  },
  availability: { type: Boolean } // Corrected spelling
});

const Labor = mongoose.model('Labor', laborSchema);

module.exports = Labor;
