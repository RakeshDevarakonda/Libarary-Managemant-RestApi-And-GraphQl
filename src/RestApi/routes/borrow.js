import express from "express";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import { borrowBook, returnBook, myBorrowHistory } from "../controllers/borrowController.js";

const router = express.Router();

// Borrow a book (members & admin can borrow too)
router.post("/borrowbook/:bookId", protect, authorizeRoles("Member", "Admin"), borrowBook);

// Return a borrowed book
router.post("/return/:borrowId", protect, returnBook);

// My borrow history
router.get("/history", protect, myBorrowHistory);

export default router;
