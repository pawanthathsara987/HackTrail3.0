import express from "express";
import multer from "multer";
import {
  getProjects,
  getProjectById,
  createProject,
  submitProposal,
} from "../controllers/freelanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return protect(req, res, next);
  }
  next();
};

router.get("/", getProjects);
router.get("/:id", optionalAuth, getProjectById);
router.post("/", protect, createProject);
router.post("/:id/proposals", protect, upload.single("attachment"), submitProposal);
router.post("/:id/proposal", protect, upload.single("attachment"), submitProposal);

export default router;
