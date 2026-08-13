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
      duration,
      price,
      page = 1,
      limit = 12,
      sort = "Most Popular",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
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

    if (category && category !== "All Categories" && category !== "all") {
      whereClause.category = category;
    }

    if (skillLevel && skillLevel !== "All Levels" && skillLevel !== "all") {
      whereClause.skillLevel = skillLevel;
    }

    if (trainingType && trainingType !== "All Types" && trainingType !== "all") {
      whereClause.trainingType = trainingType;
    }

    if (price === "free" || price === "Free") {
      whereClause.price = 0;
    } else if (price === "paid" || price === "Paid") {
      whereClause.price = { [Op.gt]: 0 };
    }

    if (duration && duration !== "Any Duration" && duration !== "all") {
      if (duration === "1–4 Weeks" || duration === "1-4 Weeks") {
        whereClause.durationWeeks = { [Op.between]: [1, 4] };
      } else if (duration === "5–8 Weeks" || duration === "5-8 Weeks") {
        whereClause.durationWeeks = { [Op.between]: [5, 8] };
      } else if (duration === "9–12 Weeks" || duration === "9-12 Weeks") {
        whereClause.durationWeeks = { [Op.between]: [9, 12] };
      } else if (duration === "12+ Weeks") {
        whereClause.durationWeeks = { [Op.gt]: 12 };
      }
    }

    let order = [["enrolledCount", "DESC"]];
    if (sort === "newest" || sort === "Newest") {
      order = [["createdAt", "DESC"]];
    } else if (sort === "rating_high" || sort === "Highest Rated") {
      order = [["rating", "DESC"], ["reviewsCount", "DESC"]];
    } else if (sort === "price_low" || sort === "Price: Low to High") {
      order = [["price", "ASC"]];
    } else if (sort === "popular" || sort === "Most Popular") {
      order = [["enrolledCount", "DESC"]];
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
      about,
      whatYouWillLearn,
      skills,
      requirements,
      curriculum,
      image,
      location,
      learningFormat,
    } = req.body;

    if (!title || !provider || !category || !duration || !description) {
      return res
        .status(400)
        .json({ message: "Please fill in all required training fields." });
    }

    const program = await TrainingProgram.create({
      title,
      provider: typeof provider === "object" ? JSON.stringify(provider) : provider,
      providerLogo: providerLogo || null,
      category,
      skillLevel: skillLevel || "Beginner",
      trainingType: trainingType || "Online",
      duration,
      durationWeeks: durationWeeks || null,
      price: price !== undefined ? price : 0,
      description,
      about: about || description,
      whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
      skills: Array.isArray(skills) ? skills : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      image: image || null,
      location: location || "Online",
      learningFormat: learningFormat || trainingType || "Online",
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

// @desc    Get enrolled training programs for logged in student
// @route   GET /api/training/my-enrollments
// @access  Private (Student)
export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await TrainingEnrollment.findAll({
      where: { studentId },
      include: [
        {
          model: TrainingProgram,
          as: "program",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching enrollments." });
  }
};
