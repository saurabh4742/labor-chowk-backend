// server/models/worker.js

const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  pincode:{type: String, required: true},
  phoneNumber: {type: String, required: true,unique:true},
  address: {type: String, required: true},
  profileImage: { type: String }
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;