import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  toggleBookmark,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

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

router.get("/", getJobs);
router.get("/:id", optionalAuth, getJobById);
router.post("/", protect, createJob);
router.post("/:id/apply", protect, applyForJob);
router.post("/:id/bookmark", protect, toggleBookmark);

export default router;
