import { Op } from "sequelize";
import { FreelanceProject, FreelanceProposal, User } from "../models/index.js";
import { uploadToSupabase } from "../services/uploadService.js";

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
      deadline,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = { status: "open" };

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
          attributes: ["id", "fullName", "email", "phone", "location", "profilePhoto"],
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

// @desc    Create a new freelance project
// @route   POST /api/freelance-projects
// @access  Private (Client)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      clientName,
      category,
      projectType,
      budget,
      budgetMin,
      budgetMax,
      deadline,
      description,
      skillsRequired,
    } = req.body;

    if (!title || !category || !budget || !description) {
      return res
        .status(400)
        .json({ message: "Please fill in all required project fields." });
    }

    const project = await FreelanceProject.create({
      clientId: req.user ? req.user.id : null,
      title,
      clientName: clientName || (req.user ? req.user.fullName : "Client"),
      clientLocation: req.user ? req.user.location : null,
      category,
      projectType: projectType || "Fixed Price",
      budget,
      budgetMin: budgetMin || null,
      budgetMax: budgetMax || null,
      deadline: deadline || "2 Weeks",
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
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
// @access  Private (Student)
export const submitProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, proposedPrice, deliveryTime, relevantSkills } = req.body;
    const studentId = req.user.id;

    const project = await FreelanceProject.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Freelance project not found." });
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
          req.file.mimetype
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
