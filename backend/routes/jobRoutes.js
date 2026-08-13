import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  deleteJob,
  applyForJob,
  toggleBookmark,
  getMyApplications,
  updateApplicationStatus,
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

router.get("/", optionalAuth, getJobs);
router.get("/my-jobs", protect, getMyJobs);
router.get("/my-applications", protect, getMyApplications);
router.put("/applications/:applicationId/status", protect, updateApplicationStatus);
router.get("/:id", optionalAuth, getJobById);
router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);
router.post("/:id/apply", protect, applyForJob);
router.post("/:id/bookmark", protect, toggleBookmark);
router.post("/:id/save", protect, toggleBookmark);
router.delete("/:id/save", protect, toggleBookmark);

export default router;

