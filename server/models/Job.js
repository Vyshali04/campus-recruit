const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  package: {
    type: String,
    required: [true, 'Please add salary package information (e.g. 12 LPA)']
  },
  location: {
    type: String,
    required: [true, 'Please add job location'],
    trim: true
  },
  requiredSkills: {
    type: [String],
    default: [],
    required: [true, 'Please add required skills']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add application deadline']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
