import { Op } from "sequelize";
import { Job, JobApplication, JobBookmark, User, Student } from "../models/index.js";
import { uploadBase64ToSupabase } from "../services/uploadService.js";

// @desc    Get all part-time jobs with search, filters, pagination, and sorting
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      salary,
      jobType,
      workingHours,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = { status: "active" };

    if (search && search.trim()) {
      const query = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { title: { [Op.like]: query } },
        { companyName: { [Op.like]: query } },
        { description: { [Op.like]: query } },
        { category: { [Op.like]: query } },
      ];
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (category) {
      whereClause.category = category;
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (workingHours) {
      whereClause.workingHours = { [Op.like]: `%${workingHours}%` };
    }

    // Determine sorting
    let order = [["createdAt", "DESC"]];
    if (sort === "salary_high") {
      order = [["salaryMax", "DESC"], ["createdAt", "DESC"]];
    } else if (sort === "salary_low") {
      order = [["salaryMin", "ASC"], ["createdAt", "DESC"]];
    } else if (sort === "oldest") {
      order = [["createdAt", "ASC"]];
    }

    const { count, rows } = await Job.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset,
      order,
    });

    let appliedJobIds = [];
    let bookmarkedJobIds = [];

    if (req.user) {
      const userApps = await JobApplication.findAll({
        where: { studentId: req.user.id },
        attributes: ["jobId"],
      });
      appliedJobIds = userApps.map((a) => a.jobId);

      const userBookmarks = await JobBookmark.findAll({
        where: { userId: req.user.id },
        attributes: ["jobId"],
      });
      bookmarkedJobIds = userBookmarks.map((b) => b.jobId);
    }

    const jobsWithStatus = rows.map((j) => {
      const jobJson = j.toJSON();
      return {
        ...jobJson,
        hasApplied: appliedJobIds.includes(j.id),
        isSaved: bookmarkedJobIds.includes(j.id),
      };
    });

    const totalPages = Math.ceil(count / limitNum) || 1;

    return res.status(200).json({
      jobs: jobsWithStatus,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: error.message || "Server error fetching jobs." });
  }
};

// @desc    Get single job details by ID
// @route   GET /api/jobs/:id
// @access  Public (Optional auth for applied/bookmarked status)
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: "poster",
          attributes: ["id", "fullName", "email", "phone", "location", "profilePhoto"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    let hasApplied = false;
    let hasBookmarked = false;

    if (req.user) {
      const application = await JobApplication.findOne({
        where: { jobId: id, studentId: req.user.id },
      });
      hasApplied = !!application;

      const bookmark = await JobBookmark.findOne({
        where: { jobId: id, userId: req.user.id },
      });
      hasBookmarked = !!bookmark;
    }

    const jobJson = job.toJSON();
    jobJson.hasApplied = hasApplied;
    jobJson.isSaved = hasBookmarked;

    return res.status(200).json({
      job: jobJson,
      hasApplied,
      hasBookmarked,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Create a new part-time job posting
// @route   POST /api/jobs
// @access  Private (Job Poster)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      companyLogo,
      image,
      category,
      location,
      jobType,
      workingHours,
      salary,
      salaryMin,
      salaryMax,
      salaryType,
      description,
      requirements,
      responsibilities,
      benefits,
      deadline,
    } = req.body;

    if (!title || !companyName || !category || !location || !description) {
      return res.status(400).json({ message: "Please fill in all required job fields." });
    }

    let imageUrl = image || companyLogo || null;
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      try {
        imageUrl = await uploadBase64ToSupabase(imageUrl, "job-post");
      } catch (err) {
        console.error("Failed to upload base64 image to job-post bucket:", err);
      }
    }

    const newJob = await Job.create({
      jobPosterId: req.user ? req.user.id : null,
      title,
      companyName,
      companyLogo: imageUrl || companyLogo || null,
      image: imageUrl || null,
      category,
      location,
      jobType: jobType || "Part-Time",
      workingHours: workingHours || "Flexible",
      salary: salary || null,
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      salaryType: salaryType || "Monthly",
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      deadline: deadline || null,
      status: "active",
    });

    return res.status(201).json({
      message: "Job posted successfully.",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: error.message || "Server error creating job." });
  }
};

// @desc    Apply for a part-time job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student)
export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, resumeUrl } = req.body;
    const studentId = req.user.id;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existingApplication = await JobApplication.findOne({
      where: { jobId: id, studentId },
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    const application = await JobApplication.create({
      jobId: id,
      studentId,
      coverLetter: coverLetter || null,
      resumeUrl: resumeUrl || null,
      status: "pending",
    });

    return res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ message: error.message || "Server error applying for job." });
  }
};

// @desc    Bookmark or unbookmark a job
// @route   POST /api/jobs/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await JobBookmark.findOne({
      where: { jobId: id, userId },
    });

    if (existing) {
      await existing.destroy();
      return res.status(200).json({ bookmarked: false, isSaved: false, message: "Job removed from bookmarks." });
    } else {
      await JobBookmark.create({ jobId: id, userId });
      return res.status(201).json({ bookmarked: true, isSaved: true, message: "Job saved to bookmarks." });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return res.status(500).json({ message: error.message || "Server error." });
  }
};

// @desc    Get jobs posted by current authenticated job poster
// @route   GET /api/jobs/my-jobs
// @access  Private (Job Poster)
export const getMyJobs = async (req, res) => {
  try {
    const jobPosterId = req.user.id;
    const jobs = await Job.findAll({
      where: { jobPosterId },
      include: [
        {
          model: JobApplication,
          as: "applications",
          include: [
            {
              model: User,
              as: "applicant",
              attributes: ["id", "fullName", "email", "phone", "location", "profilePhoto"],
              include: [
                {
                  model: Student,
                  as: "studentProfile",
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching poster jobs:", error);
    return res.status(500).json({ message: error.message || "Server error fetching poster jobs." });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Job Poster)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.jobPosterId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this job." });
    }

    await job.destroy();
    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: error.message || "Server error deleting job." });
  }
};

// @desc    Get applied/enrolled part-time jobs for logged-in student
// @route   GET /api/jobs/my-applications
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await JobApplication.findAll({
      where: { studentId },
      include: [
        {
          model: Job,
          as: "job",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching student job applications:", error);
    return res.status(500).json({ message: error.message || "Server error fetching applications." });
  }
};

// @desc    Update status of a job application (accept, reject, review)
// @route   PUT /api/jobs/applications/:applicationId/status
// @access  Private (Job Poster)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status." });
    }

    const application = await JobApplication.findByPk(applicationId, {
      include: [{ model: Job, as: "job" }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.job.jobPosterId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this application." });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: error.message || "Server error updating application status." });
  }
};

