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
  }
  // Add more fields as needed
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;