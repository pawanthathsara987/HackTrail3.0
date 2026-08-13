import { supabase } from "../config/supabase.js";
import path from "path";

const DEFAULT_BUCKET = "profile-img";

/**
 * Uploads a file buffer to Supabase storage bucket
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} bucketName - Supabase storage bucket name (default 'profile-img')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadToSupabase = async (
  fileBuffer,
  originalName,
  mimeType,
  bucketName = DEFAULT_BUCKET
) => {
  try {
    const ext = path.extname(originalName) || ".jpg";
    const prefix = bucketName === "job-post" ? "job" : bucketName === "client-upload" ? "client_attachment" : "profile";
    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    throw error;
  }
};

/**
 * Uploads a base64 encoded image string to Supabase storage bucket
 * @param {string} base64Data - Base64 data string (data:image/png;base64,...)
 * @param {string} bucketName - Supabase storage bucket name (default 'profile-img')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadBase64ToSupabase = async (base64Data, bucketName = DEFAULT_BUCKET) => {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image data string format.");
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const ext = mimeType.split("/")[1] || "jpeg";
    const prefix = bucketName === "job-post" ? "job" : "profile";
    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase base64 upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading base64 to Supabase:", error);
    throw error;
  }
};
