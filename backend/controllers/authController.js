import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/database.js";
import { User, Student, JobPoster, Client } from "../models/index.js";
import { uploadBase64ToSupabase } from "../services/uploadService.js";

const JWT_SECRET = process.env.JWT_SECRET || "opportunityx_secret_key";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user (role-based)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      role,
      fullName,
      email,
      password,
      phone,
      location,
      profilePhoto,
      dateOfBirth,
      gender,
      // Student
      educationLevel,
      institutionName,
      fieldOfStudy,
      graduationYear,
      skills,
      interests,
      careerGoals,
      experienceLevel,
      // Job Poster
      organizationName,
      organizationType,
      industry,
      organizationDescription,
      website,
      businessLocation,
      // Client
      servicesInterested,
      projectCategories,
      budgetRange,
      preferredSkills,
      hiringDescription,
    } = req.body;

    // 1. Validation
    if (!role || !["student", "job_poster", "client"].includes(role)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid or missing role." });
    }

    if (!fullName || !email || !password || !phone || !location) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Please fill in all required user fields." });
    }

    // Role-specific validation
    if (role === "student") {
      if (
        !educationLevel ||
        !institutionName ||
        !fieldOfStudy ||
        !graduationYear ||
        !experienceLevel
      ) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Please fill in all required student details." });
      }
    } else if (role === "job_poster") {
      if (
        !organizationName ||
        !organizationType ||
        !industry ||
        !organizationDescription ||
        !businessLocation
      ) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Please fill in all required organization details." });
      }
    } else if (role === "client") {
      if (
        !servicesInterested ||
        !projectCategories ||
        !budgetRange ||
        !preferredSkills
      ) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Please fill in all required client details." });
      }
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "An account with this email address already exists." });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3.5 Handle profile photo upload to Supabase bucket 'profile-img' if provided as base64 string
    let finalProfilePhotoUrl = null;
    if (profilePhoto) {
      if (typeof profilePhoto === "string" && profilePhoto.startsWith("data:image")) {
        try {
          finalProfilePhotoUrl = await uploadBase64ToSupabase(profilePhoto);
        } catch (uploadErr) {
          console.error("Base64 profile photo upload to Supabase failed:", uploadErr);
        }
      } else if (typeof profilePhoto === "string") {
        finalProfilePhotoUrl = profilePhoto;
      }
    }

    // 4. Create base user
    const newUser = await User.create(
      {
        role,
        fullName,
        email,
        password: hashedPassword,
        phone,
        location,
        profilePhoto: finalProfilePhotoUrl,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
      },
      { transaction }
    );

    // 5. Create role-specific profile
    let roleProfile = null;

    if (role === "student") {
      roleProfile = await Student.create(
        {
          userId: newUser.id,
          educationLevel,
          institutionName,
          fieldOfStudy,
          graduationYear: String(graduationYear),
          skills: Array.isArray(skills) ? skills : [],
          interests: interests || null,
          careerGoals: careerGoals || null,
          experienceLevel,
        },
        { transaction }
      );
    } else if (role === "job_poster") {
      roleProfile = await JobPoster.create(
        {
          userId: newUser.id,
          organizationName,
          organizationType,
          industry,
          organizationDescription,
          website: website || null,
          businessLocation,
        },
        { transaction }
      );
    } else if (role === "client") {
      roleProfile = await Client.create(
        {
          userId: newUser.id,
          servicesInterested,
          projectCategories,
          budgetRange,
          preferredSkills,
          hiringDescription: hiringDescription || null,
        },
        { transaction }
      );
    }

    // 6. Commit transaction
    await transaction.commit();

    // 7. Generate token and return response
    const token = generateToken(newUser.id, newUser.role);

    const userResponse = {
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      location: newUser.location,
      profilePhoto: newUser.profilePhoto,
      dateOfBirth: newUser.dateOfBirth,
      gender: newUser.gender,
      createdAt: newUser.createdAt,
      profile: roleProfile,
    };

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error during registration." });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    // 1. Find user by email and include role profiles
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Student, as: "studentProfile" },
        { model: JobPoster, as: "jobPosterProfile" },
        { model: Client, as: "clientProfile" },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Generate token
    const token = generateToken(user.id, user.role);

    // 4. Return user response
    const userResponse = {
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      profilePhoto: user.profilePhoto,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      createdAt: user.createdAt,
      studentProfile: user.studentProfile || null,
      jobPosterProfile: user.jobPosterProfile || null,
      clientProfile: user.clientProfile || null,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error during login." });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Student, as: "studentProfile" },
        { model: JobPoster, as: "jobPosterProfile" },
        { model: Client, as: "clientProfile" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching user profile." });
  }
};
