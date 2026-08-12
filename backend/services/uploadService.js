import { supabase } from "../config/supabase.js";
import path from "path";

const BUCKET_NAME = "profile-img";

/**
 * Uploads a file buffer to Supabase storage bucket 'profile-img'
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadToSupabase = async (fileBuffer, originalName, mimeType) => {
  try {
    const ext = path.extname(originalName) || ".jpg";
    const fileName = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    throw error;
  }
};

/**
 * Uploads a base64 encoded image string to Supabase storage bucket 'profile-img'
 * @param {string} base64Data - Base64 data string (data:image/png;base64,...)
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadBase64ToSupabase = async (base64Data) => {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image data string format.");
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const ext = mimeType.split("/")[1] || "jpeg";
    const fileName = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase base64 upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading base64 to Supabase:", error);
    throw error;
  }
};
