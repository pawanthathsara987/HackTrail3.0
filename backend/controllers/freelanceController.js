import { Op } from "sequelize";
import { FreelanceProject, FreelanceProposal, User } from "../models/index.js";
import { uploadToSupabase, uploadBase64ToSupabase } from "../services/uploadService.js";

// @desc    Get all freelance projects with search, filtering & pagination
// @route   GET /api/freelance-projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const {
      search,
      category,
      skills,
      budget,
      projectType,
      postType,
      clientId,
      deadline,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};
    if (clientId) {
      whereClause.clientId = clientId;
    } else {
      whereClause.status = "open";
    }

    if (search && search.trim()) {
      const query = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { title: { [Op.like]: query } },
        { clientName: { [Op.like]: query } },
        { description: { [Op.like]: query } },
        { category: { [Op.like]: query } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (projectType) {
      whereClause.projectType = projectType;
    }

    if (postType) {
      whereClause.postType = postType;
    }

    if (budget) {
      whereClause.budget = { [Op.like]: `%${budget}%` };
    }

    let order = [["createdAt", "DESC"]];
    if (sort === "budget_high") {
      order = [["budgetMax", "DESC"], ["createdAt", "DESC"]];
    } else if (sort === "budget_low") {
      order = [["budgetMin", "ASC"], ["createdAt", "DESC"]];
    } else if (sort === "proposals_low") {
      order = [["proposalsCount", "ASC"]];
    }

    const { count, rows } = await FreelanceProject.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset,
      order,
    });

    const totalPages = Math.ceil(count / limitNum) || 1;

    return res.status(200).json({
      projects: rows,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching freelance projects:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching projects." });
  }
};

// @desc    Get single freelance project details
// @route   GET /api/freelance-projects/:id
// @access  Public (Optional auth for proposal submission check)
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await FreelanceProject.findByPk(id, {
      include: [
        {
          model: User,
          as: "client",
          required: false,
          attributes: ["id", "fullName", "email", "phone", "location", "profilePhoto", "role"],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Freelance project not found." });
    }

    let alreadySubmitted = false;
    if (req.user) {
      const proposal = await FreelanceProposal.findOne({
        where: { projectId: id, studentId: req.user.id },
      });
      alreadySubmitted = !!proposal;
    }

    return res.status(200).json({
      project,
      alreadySubmitted,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Create a new freelance project or student skill gig (Fiverr style)
// @route   POST /api/freelance-projects
// @access  Private (Client / Student)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      clientName,
      category,
      projectType,
      postType,
      budget,
      budgetMin,
      budgetMax,
      deadline,
      description,
      skillsRequired,
      projectImage,
      deliverables,
    } = req.body;

    if (!title || !category || !budget || !description) {
      return res
        .status(400)
        .json({ message: "Please fill in all required project fields." });
    }

    let finalProjectImage = null;
    if (projectImage) {
      if (typeof projectImage === "string" && projectImage.startsWith("data:image")) {
        try {
          finalProjectImage = await uploadBase64ToSupabase(projectImage);
        } catch (uploadErr) {
          console.error("Project image upload to Supabase failed:", uploadErr);
        }
      } else if (typeof projectImage === "string") {
        finalProjectImage = projectImage;
      }
    }

    const project = await FreelanceProject.create({
      clientId: req.user ? req.user.id : null,
      title,
      clientName: clientName || (req.user ? req.user.fullName : "Client"),
      clientLocation: req.user ? req.user.location : null,
      posterRole: req.user ? req.user.role : "client",
      postType: postType || (req.user && req.user.role === "student" ? "gig" : "project"),
      category,
      projectType: projectType || "Fixed Price",
      budget,
      budgetMin: budgetMin || null,
      budgetMax: budgetMax || null,
      deadline: deadline || "2 Days",
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      projectImage: finalProjectImage,
      status: "open",
    });

    return res.status(201).json({
      message: "Freelance project posted successfully.",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error creating project." });
  }
};

// @desc    Submit proposal for freelance project
// @route   POST /api/freelance-projects/:id/proposals
// @access  Private (Authenticated Users)
export const submitProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, proposedPrice, deliveryTime, relevantSkills } = req.body;
    const studentId = req.user.id;

    const project = await FreelanceProject.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Freelance project not found." });
    }

    if (project.clientId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot submit a proposal for your own project." });
    }

    const existingProposal = await FreelanceProposal.findOne({
      where: { projectId: id, studentId },
    });

    if (existingProposal) {
      return res
        .status(400)
        .json({ message: "You have already submitted a proposal for this project." });
    }

    let attachmentUrl = null;
    if (req.file) {
      try {
        attachmentUrl = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          "client-upload"
        );
      } catch (uploadErr) {
        console.error("Proposal attachment upload failed:", uploadErr);
      }
    }

    const proposal = await FreelanceProposal.create({
      projectId: id,
      studentId,
      coverLetter,
      proposedPrice: parseFloat(proposedPrice) || 0,
      deliveryTime,
      relevantSkills: relevantSkills || null,
      attachmentUrl,
      status: "pending",
    });

    // Increment proposalsCount
    await project.increment("proposalsCount", { by: 1 });

    return res.status(201).json({
      message: "Proposal submitted successfully!",
      proposal,
    });
  } catch (error) {
    console.error("Error submitting proposal:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error submitting proposal." });
  }
};

// @desc    Update a freelance project / gig
// @route   PUT /api/freelance-projects/:id
// @access  Private (Owner / Client / Student)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await FreelanceProject.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Freelance post not found." });
    }

    if (req.user && project.clientId && project.clientId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post." });
    }

    const {
      title,
      category,
      projectType,
      budget,
      budgetMin,
      budgetMax,
      deadline,
      description,
      skillsRequired,
      deliverables,
      projectImage,
    } = req.body;

    let finalProjectImage = project.projectImage;
    if (projectImage) {
      if (typeof projectImage === "string" && projectImage.startsWith("data:image")) {
        try {
          finalProjectImage = await uploadBase64ToSupabase(projectImage);
        } catch (uploadErr) {
          console.error("Project image upload failed:", uploadErr);
        }
      } else if (typeof projectImage === "string") {
        finalProjectImage = projectImage;
      }
    }

    await project.update({
      title: title || project.title,
      category: category || project.category,
      projectType: projectType || project.projectType,
      budget: budget || project.budget,
      budgetMin: budgetMin !== undefined ? budgetMin : project.budgetMin,
      budgetMax: budgetMax !== undefined ? budgetMax : project.budgetMax,
      deadline: deadline || project.deadline,
      description: description || project.description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : project.skillsRequired,
      deliverables: Array.isArray(deliverables) ? deliverables : project.deliverables,
      projectImage: finalProjectImage,
    });

    return res.status(200).json({
      message: "Freelance post updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: error.message || "Server error updating post." });
  }
};

// @desc    Delete a freelance project / gig
// @route   DELETE /api/freelance-projects/:id
// @access  Private (Owner / Client / Student)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await FreelanceProject.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Freelance post not found." });
    }

    if (req.user && project.clientId && project.clientId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await project.destroy();

    return res.status(200).json({
      message: "Freelance post deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: error.message || "Server error deleting post." });
  }
};

// @desc    Get freelance proposals submitted by logged-in student
// @route   GET /api/freelance-projects/my-proposals
// @access  Private (Student)
export const getMyProposals = async (req, res) => {
  try {
    const studentId = req.user.id;
    const proposals = await FreelanceProposal.findAll({
      where: { studentId },
      include: [
        {
          model: FreelanceProject,
          as: "project",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ proposals });
  } catch (error) {
    console.error("Error fetching student proposals:", error);
    return res.status(500).json({ message: error.message || "Server error fetching proposals." });
  }
};
