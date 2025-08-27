import express from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  getBook
} from "../controllers/bookController.js";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import { bookCreateValidation, bookUpdateValidation } from "../../utils/validators.js";

const router = express.Router();

// Public read
router.get("/", listBooks);
router.get("/:id", getBook);

// Admin operations
router.post("/addbook", protect, authorizeRoles("Admin"), bookCreateValidation, createBook);
router.put("/editbook/:id", protect, authorizeRoles("Admin"),bookUpdateValidation, updateBook);
router.delete("/deletebook/:id", protect, authorizeRoles("Admin"), deleteBook);

export default router;
