import { validationResult } from "express-validator";

import Book from "../../models/Book.js";
import { throwError } from "../../utils/throwError.js";
import { validateObjectId } from "../../utils/validators.js";

export const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throwError(
        400,
        errors
          .array()
          .map((e) => e.msg)
          .join(", ")
      );

    const { title, author, isbn, publicationDate, genre, totalCopies } = req.body;

    const existingBook = await Book.findOne({
      $or: [
        { isbn: isbn || null }, // check ISBN if provided
        { title: title.trim(), author: author.trim() }, // check title + author
      ],
    });

    if (existingBook)
      throwError(400, "Book with same title/author or ISBN already exists");

    const book = await Book.create({
      title,
      author,
      isbn,
      publicationDate,
      genre,
      availableCopies: totalCopies,
      totalCopies
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: book.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    validateObjectId(id, "Book ID");

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!book) throwError(404, "Book not found");

    res.json({
      success: true,
      message: "Book Details Changed Succesfully",
      book,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "Book ID");

    const book = await Book.findByIdAndDelete(id);
    if (!book) throwError(404, "Book not found");

    // Optional: delete borrow records if you want
    res.json({ success: true, message: "Book deleted", book });
  } catch (err) {
    next(err);
  }
};

export const listBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // all books

    res.json({
      total: books.length,
      data: books,
    });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "Book ID");

    const book = await Book.findById(id);
    if (!book) throwError(404, "Book not found");

    res.json({ book });
  } catch (err) {
    next(err);
  }
};
