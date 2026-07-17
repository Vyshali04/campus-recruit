const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants
} = require('../controllers/jobController');
const { protect, isRecruiter } = require('../middleware/auth');

// Public/All Auth users routes
router.get('/', getJobs);

// Recruiter-specific routes (must be checked BEFORE getJobById, otherwise 'my' is matched as ':id')
router.get('/my', protect, isRecruiter, getMyJobs);

// Job details route
router.get('/:id', getJobById);

// Recruiter actions
router.post('/', protect, isRecruiter, createJob);
router.put('/:id', protect, isRecruiter, updateJob);
router.delete('/:id', protect, isRecruiter, deleteJob);
router.get('/:id/applicants', protect, isRecruiter, getJobApplicants);

module.exports = router;
