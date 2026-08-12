import { uploadToSupabase } from "../services/uploadService.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
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
