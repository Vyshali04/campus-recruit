const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, isStudent, isRecruiter } = require('../middleware/auth');

// Student-specific application routes
router.get('/my', protect, isStudent, getMyApplications);
router.post('/:jobId', protect, isStudent, applyJob);

// Recruiter-specific status updates
router.put('/:id/status', protect, isRecruiter, updateApplicationStatus);

module.exports = router;
