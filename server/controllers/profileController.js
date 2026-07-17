const StudentProfile = require('../models/StudentProfile');

// @desc    Get current student's profile
// @route   GET /api/profile
// @access  Private (Student only)
exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id }).populate({
      path: 'userId',
      select: 'name email'
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

// @desc    Update student profile
// @route   PUT /api/profile
// @access  Private (Student only)
exports.updateProfile = async (req, res) => {
  try {
    const { college, department, cgpa, skills, resumeLink } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Fallback: create profile if not found for some reason
      profile = new StudentProfile({ userId: req.user._id });
    }

    // Update fields
    if (college !== undefined) profile.college = college;
    if (department !== undefined) profile.department = department;
    if (cgpa !== undefined) profile.cgpa = cgpa === '' ? null : Number(cgpa);
    if (resumeLink !== undefined) profile.resumeLink = resumeLink;

    // Handle skills (if string convert to array, otherwise array)
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        profile.skills = skills.map(s => s.trim());
      } else if (typeof skills === 'string') {
        profile.skills = skills.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    }

    await profile.save();

    const populatedProfile = await StudentProfile.findOne({ userId: req.user._id }).populate({
      path: 'userId',
      select: 'name email'
    });

    res.status(200).json({ success: true, data: populatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};
