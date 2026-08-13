import { uploadToSupabase } from "../services/uploadService.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      "profile-img"
    );

    return res.status(200).json({
      message: "Profile image uploaded successfully.",
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    return res.status(500).json({
      message: error.message || "Failed to upload image to Supabase.",
    });
  }
};

export const uploadJobImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      "job-post"
    );

    return res.status(200).json({
      message: "Job image uploaded successfully.",
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error("Job upload controller error:", error);
    return res.status(500).json({
      message: error.message || "Failed to upload job image to Supabase.",
    });
  }
};
