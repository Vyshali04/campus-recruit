const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { company, title, description, package: pkg, location, requiredSkills, deadline } = req.body;

    if (!company || !title || !description || !pkg || !location || !requiredSkills || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Handle requiredSkills if passed as a string or array
    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills.map(s => s.trim());
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
    }

    const job = await Job.create({
      recruiterId: req.user._id,
      company,
      title,
      description,
      package: pkg,
      location,
      requiredSkills: skillsArray,
      deadline
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Server error creating job' });
  }
};

// @desc    Get all jobs (with optional filters: search, location, skills)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, location, skills } = req.query;
    let query = {};

    // 1. Search filter (title, company, description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // 3. Skills filter (case-insensitive check for array matching)
    if (skills) {
      // Expect comma-separated skills or array
      const skillsList = typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(s => s !== '')
        : skills;
      
      if (skillsList.length > 0) {
        // Find jobs where at least one of the job's required skills matches the query skills (case-insensitive regex)
        const regexes = skillsList.map(skill => new RegExp(`^${skill}$`, 'i'));
        query.requiredSkills = { $in: regexes };
      }
    }

    // Sort by most recent
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/my
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('Error getting my jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your jobs' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.targetJobId || req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error('Error getting job by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching job details' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is the job owner
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const { company, title, description, package: pkg, location, requiredSkills, deadline } = req.body;

    // Handle requiredSkills conversion
    let skillsArray = job.requiredSkills;
    if (requiredSkills !== undefined) {
      if (Array.isArray(requiredSkills)) {
        skillsArray = requiredSkills.map(s => s.trim());
      } else if (typeof requiredSkills === 'string') {
        skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        company: company || job.company,
        title: title || job.title,
        description: description || job.description,
        package: pkg || job.package,
        location: location || job.location,
        requiredSkills: skillsArray,
        deadline: deadline || job.deadline
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Server error updating job' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is the job owner
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    // Delete job from database
    await Job.findByIdAndDelete(req.params.id);

    // Clean up applications for this job
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({ success: true, message: 'Job and associated applications deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error deleting job' });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/jobs/:id/applicants
// @access  Private (Recruiter only)
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is the job owner
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    // Find applications, populate student user info and student profile details
    const applications = await Application.find({ jobId: req.params.id })
      .populate({
        path: 'studentId',
        select: 'name email'
      })
      .sort({ appliedAt: -1 });

    // Since we populated studentId, we'll manually fetch profiles or use lookup. Let's map over applications and query the profile details
    const populatedApplicants = await Promise.all(
      applications.map(async (app) => {
        const studentProfile = await require('../models/StudentProfile').findOne({ userId: app.studentId._id });
        return {
          _id: app._id,
          status: app.status,
          appliedAt: app.appliedAt,
          student: {
            id: app.studentId._id,
            name: app.studentId.name,
            email: app.studentId.email,
            college: studentProfile ? studentProfile.college : '',
            department: studentProfile ? studentProfile.department : '',
            cgpa: studentProfile ? studentProfile.cgpa : null,
            skills: studentProfile ? studentProfile.skills : [],
            resumeLink: studentProfile ? studentProfile.resumeLink : ''
          }
        };
      })
    );

    res.status(200).json({ success: true, count: populatedApplicants.length, data: populatedApplicants });
  } catch (error) {
    console.error('Error fetching job applicants:', error);
    res.status(500).json({ success: false, message: 'Server error fetching job applicants' });
  }
};
