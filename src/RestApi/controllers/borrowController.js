import mongoose from "mongoose";
import Borrow from "../../models/Borrow.js";
import Book from "../../models/Book.js";
import { throwError } from "../../utils/throwError.js";
import { validateObjectId } from "../../utils/validators.js";

export const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    validateObjectId(bookId, "Book ID");

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) throwError(404, "Book not found");
    if (book.availableCopies <= 0) throwError(400, "No copies available");

    const activeBorrow = await Borrow.findOne({
      book: book._id,
      user: req.user._id,
      status: "Borrowed", // only active borrows
    });

    if (activeBorrow)
      throwError(400, "You must return this book before borrowing again");

    // Create borrow record
    const borrow = await Borrow.create({
      user: req.user._id,
      book: book._id,
    });

    // Decrement book copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (err) {
    next(err);
  }
};
export const returnBook = async (req, res, next) => {
  try {
    const { borrowId } = req.params;

    // Validate borrowId
    validateObjectId(borrowId, "Borrow Book ID");

    // Find borrow record
    const borrow = await Borrow.findById(borrowId).populate("book");
    if (!borrow) throwError(404, "Borrow record not found");
    if (borrow.status === "Returned") throwError(400, "Book already returned");

    // Update borrow record
    borrow.status = "Returned";
    borrow.returnDate = new Date();
    await borrow.save();

    // Increment book copies
    const book = borrow.book;
    book.availableCopies = (book.availableCopies || 0) + 1;
    await book.save();

    res.json({
      success:true,
      message: "Book returned successfully",
      borrow,
    });
  } catch (err) {
    next(err);
  }
};



export const myBorrowHistory = async (req, res, next) => {
  try {
    const records = await Borrow.find({ user: req.user._id })
      .populate("book", "title author isbn genre")
      .sort({ borrowDate: -1 });

    res.json({
      total: records.length,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

