import express from "express";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import { mostBorrowedBooks, activeMembers, bookAvailability } from "../controllers/reportController.js";

const router = express.Router();

router.get("/most-borrowed", protect, authorizeRoles("Admin"), mostBorrowedBooks);
router.get("/active-members", protect, authorizeRoles("Admin"), activeMembers);
router.get("/book-availability", protect, authorizeRoles("Admin"), bookAvailability);

export default router;
