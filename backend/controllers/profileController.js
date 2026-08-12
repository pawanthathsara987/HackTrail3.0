import { sequelize } from "../config/database.js";
import { User, Student, JobPoster, Client } from "../models/index.js";
import { uploadBase64ToSupabase } from "../services/uploadService.js";

// @desc    Get logged in user profile with role-specific details
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
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
    console.error("Error fetching profile:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching profile." });
  }
};

// @desc    Update logged in user profile (base + role profile)
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found." });
    }

    const {
      fullName,
      phone,
      location,
      profilePhoto,
      dateOfBirth,
      gender,
      // Student profile fields
      educationLevel,
      institutionName,
      fieldOfStudy,
      graduationYear,
      skills,
      interests,
      careerGoals,
      experienceLevel,
      // Job Poster profile fields
      organizationName,
      organizationType,
      industry,
      organizationDescription,
      website,
      businessLocation,
      // Client profile fields
      servicesInterested,
      projectCategories,
      budgetRange,
      preferredSkills,
      hiringDescription,
    } = req.body;

    // Handle profile photo upload if provided as base64
    let finalProfilePhotoUrl = user.profilePhoto;
    if (profilePhoto) {
      if (
        typeof profilePhoto === "string" &&
        profilePhoto.startsWith("data:image")
      ) {
        try {
          finalProfilePhotoUrl = await uploadBase64ToSupabase(profilePhoto);
        } catch (uploadErr) {
          console.error(
            "Failed to upload updated profile photo to Supabase:",
            uploadErr
          );
        }
      } else if (typeof profilePhoto === "string") {
        finalProfilePhotoUrl = profilePhoto;
      }
    }

    // Update base user fields
    await user.update(
      {
        fullName: fullName !== undefined ? fullName : user.fullName,
        phone: phone !== undefined ? phone : user.phone,
        location: location !== undefined ? location : user.location,
        profilePhoto: finalProfilePhotoUrl,
        dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : user.dateOfBirth,
        gender: gender !== undefined ? gender : user.gender,
      },
      { transaction }
    );

    // Update role profile based on user.role
    if (user.role === "student") {
      let student = await Student.findOne({ where: { userId }, transaction });
      const studentData = {
        educationLevel,
        institutionName,
        fieldOfStudy,
        graduationYear: graduationYear ? String(graduationYear) : undefined,
        skills: Array.isArray(skills) ? skills : undefined,
        interests,
        careerGoals,
        experienceLevel,
      };

      // Filter out undefined keys
      Object.keys(studentData).forEach(
        (key) => studentData[key] === undefined && delete studentData[key]
      );

      if (student) {
        await student.update(studentData, { transaction });
      } else {
        await Student.create({ userId, ...studentData }, { transaction });
      }
    } else if (user.role === "job_poster") {
      let jobPoster = await JobPoster.findOne({ where: { userId }, transaction });
      const jobPosterData = {
        organizationName,
        organizationType,
        industry,
        organizationDescription,
        website,
        businessLocation,
      };

      Object.keys(jobPosterData).forEach(
        (key) => jobPosterData[key] === undefined && delete jobPosterData[key]
      );

      if (jobPoster) {
        await jobPoster.update(jobPosterData, { transaction });
      } else {
        await JobPoster.create({ userId, ...jobPosterData }, { transaction });
      }
    } else if (user.role === "client") {
      let client = await Client.findOne({ where: { userId }, transaction });
      const clientData = {
        servicesInterested,
        projectCategories,
        budgetRange,
        preferredSkills,
        hiringDescription,
      };

      Object.keys(clientData).forEach(
        (key) => clientData[key] === undefined && delete clientData[key]
      );

      if (client) {
        await client.update(clientData, { transaction });
      } else {
        await Client.create({ userId, ...clientData }, { transaction });
      }
    }

    await transaction.commit();

    // Fetch updated user with associated role profile
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Student, as: "studentProfile" },
        { model: JobPoster, as: "jobPosterProfile" },
        { model: Client, as: "clientProfile" },
      ],
    });

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error updating profile." });
  }
};
