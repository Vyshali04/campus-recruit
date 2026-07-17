const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect, isStudent } = require('../middleware/auth');

router.route('/')
  .get(protect, isStudent, getProfile)
  .put(protect, isStudent, updateProfile);

module.exports = router;
