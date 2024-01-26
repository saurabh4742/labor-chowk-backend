const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  officeAddress: {
    type: String,
    required: true
  },
  areaPincode: {
    type: String, // Changed type to String
    required: true
  },
  dailySalary: {
    type: Number,
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now  
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;