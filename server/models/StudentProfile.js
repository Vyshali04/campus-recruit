const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  college: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  cgpa: {
    type: Number,
    default: null
  },
  skills: {
    type: [String],
    default: []
  },
  resumeLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
