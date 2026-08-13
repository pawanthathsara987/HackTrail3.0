import express from "express";
import multer from "multer";
import {
  uploadProfileImage,
  uploadJobImage,
  uploadClientAttachment,
} from "../controllers/uploadController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const router = express.Router();

// POST /api/upload/profile-image
router.post(
  "/profile-image",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadProfileImage
);

// POST /api/upload/job-image
router.post(
  "/job-image",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadJobImage
);

// POST /api/upload/client-attachment
router.post(
  "/client-attachment",
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadClientAttachment
);

export default router;
