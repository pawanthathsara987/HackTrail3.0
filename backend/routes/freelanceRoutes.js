import express from "express";
import multer from "multer";
import {
  getProjects,
  getProjectById,
  createProject,
  submitProposal,
  updateProject,
  deleteProject,
  getMyProposals,
  payAndHireGig,
  payAndHireProposal,
  getClientReceivedProposals,
  getProjectProposals,
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
router.get("/my-proposals", protect, getMyProposals);
router.get("/client/received-proposals", protect, getClientReceivedProposals);
router.get("/:id/proposals-list", protect, getProjectProposals);
router.get("/:id", optionalAuth, getProjectById);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/:id/proposals", protect, upload.single("attachment"), submitProposal);
router.post("/:id/proposal", protect, upload.single("attachment"), submitProposal);

// Payment & Hiring routes
router.post("/:id/pay-and-hire", protect, payAndHireGig);
router.post("/proposals/:proposalId/pay-and-hire", protect, payAndHireProposal);

export default router;
