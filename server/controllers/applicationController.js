const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student only)
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user._id;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if deadline has passed
    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({ studentId, jobId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      studentId,
      jobId,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Server error during job application' });
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my
// @access  Private (Student only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'company title package location requiredSkills deadline'
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Error getting student applications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your applications' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status: Pending, Shortlisted, Rejected' });
    }

    // Find the application
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Make sure the recruiter owns the job associated with this application
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update status for this job application' });
    }

    // Update status
    application.status = status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Server error updating application status' });
  }
};
