import express from "express";
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  enrollProgram,
  getMyEnrollments,
} from "../controllers/trainingController.js";
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

router.get("/", getPrograms);
router.get("/my-enrollments", protect, getMyEnrollments);
router.get("/:id", optionalAuth, getProgramById);
router.post("/", protect, createProgram);
router.put("/:id", protect, updateProgram);
router.delete("/:id", protect, deleteProgram);
router.post("/:id/enroll", protect, enrollProgram);

export default router;
