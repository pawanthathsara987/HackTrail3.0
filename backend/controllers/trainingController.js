import { Op } from "sequelize";
import { TrainingProgram, TrainingEnrollment, User } from "../models/index.js";

// @desc    Get all training programs with search, filters, sorting & pagination
// @route   GET /api/training (or /api/training-programs)
// @access  Public
export const getPrograms = async (req, res) => {
  try {
    const {
      search,
      category,
      skillLevel,
      trainingType,
      price,
      page = 1,
      limit = 10,
      sort = "popular",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};

    if (search && search.trim()) {
      const query = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { title: { [Op.like]: query } },
        { provider: { [Op.like]: query } },
        { description: { [Op.like]: query } },
        { category: { [Op.like]: query } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (skillLevel) {
      whereClause.skillLevel = skillLevel;
    }

    if (trainingType) {
      whereClause.trainingType = trainingType;
    }

    if (price === "free") {
      whereClause.price = 0;
    } else if (price === "paid") {
      whereClause.price = { [Op.gt]: 0 };
    }

    let order = [["enrolledCount", "DESC"]];
    if (sort === "newest") {
      order = [["createdAt", "DESC"]];
    } else if (sort === "rating_high") {
      order = [["rating", "DESC"], ["reviewsCount", "DESC"]];
    } else if (sort === "price_low") {
      order = [["price", "ASC"]];
    }

    const { count, rows } = await TrainingProgram.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset,
      order,
    });

    const totalPages = Math.ceil(count / limitNum) || 1;

    return res.status(200).json({
      programs: rows,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching training programs:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching training programs." });
  }
};

// @desc    Get single training program details
// @route   GET /api/training/:id
// @access  Public (Optional auth for enrollment status)
export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await TrainingProgram.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Training program not found." });
    }

    let isEnrolled = false;
    if (req.user) {
      const enrollment = await TrainingEnrollment.findOne({
        where: { trainingId: id, studentId: req.user.id },
      });
      isEnrolled = !!enrollment;
    }

    return res.status(200).json({
      program,
      isEnrolled,
    });
  } catch (error) {
    console.error("Error fetching program details:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Create a new training program
// @route   POST /api/training
// @access  Private (Admin / Instructor)
export const createProgram = async (req, res) => {
  try {
    const {
      title,
      provider,
      providerLogo,
      category,
      skillLevel,
      trainingType,
      duration,
      durationWeeks,
      price,
      description,
      curriculum,
      image,
    } = req.body;

    if (!title || !provider || !category || !duration || !description) {
      return res
        .status(400)
        .json({ message: "Please fill in all required training fields." });
    }

    const program = await TrainingProgram.create({
      title,
      provider,
      providerLogo: providerLogo || null,
      category,
      skillLevel: skillLevel || "Beginner",
      trainingType: trainingType || "Online",
      duration,
      durationWeeks: durationWeeks || null,
      price: price !== undefined ? price : 0,
      description,
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      image: image || null,
    });

    return res.status(201).json({
      message: "Training program created successfully.",
      program,
    });
  } catch (error) {
    console.error("Error creating training program:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error creating training program." });
  }
};

// @desc    Enroll in a training program
// @route   POST /api/training/:id/enroll
// @access  Private (Student)
export const enrollProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const program = await TrainingProgram.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: "Training program not found." });
    }

    const existingEnrollment = await TrainingEnrollment.findOne({
      where: { trainingId: id, studentId },
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this training program." });
    }

    const enrollment = await TrainingEnrollment.create({
      trainingId: id,
      studentId,
      status: "enrolled",
    });

    // Increment enrolledCount
    await program.increment("enrolledCount", { by: 1 });

    return res.status(201).json({
      message: "Successfully enrolled in training program!",
      enrollment,
    });
  } catch (error) {
    console.error("Error enrolling in training program:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error enrolling in program." });
  }
};
