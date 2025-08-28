import mongoose from "mongoose";
import Book from "../../models/Book.js";

// Create Book
export const createBook = async (data) => {
  const { title, author, isbn, publicationDate, genre, totalCopies } = data;

  // Required fields check
  if (!title || !author || !isbn || totalCopies === undefined) {
    throw new Error("Title, author, ISBN, and totalCopies are required");
  }

  // totalCopies must be a positive integer
  if (totalCopies <= 0 || !Number.isInteger(totalCopies)) {
    throw new Error("totalCopies must be a positive integer");
  }

  // ISBN uniqueness check
  const existing = await Book.findOne({ isbn });
  if (existing) {
    throw new Error("Book with this ISBN already exists");
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    publicationDate,
    genre,
    totalCopies,
    availableCopies: totalCopies, // Initialize availableCopies same as totalCopies
  });

  return book;
};

// Update Book
export const updateBook = async (id, updates) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid book ID");
  }

  // Ensure totalCopies ≥ availableCopies
  if (
    updates.totalCopies !== undefined &&
    (updates.totalCopies <= 0 || !Number.isInteger(updates.totalCopies))
  ) {
    throw new Error("totalCopies must be a positive integer");
  }

  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  // Adjust availableCopies if totalCopies is reduced
  if (
    updates.totalCopies !== undefined &&
    updates.totalCopies < book.availableCopies
  ) {
    book.availableCopies = updates.totalCopies;
  }

  Object.assign(book, updates);
  await book.save();

  return book;
};

// Delete Book
export const deleteBook = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid book ID");
  }

  const book = await Book.findByIdAndDelete(id);
  if (!book) throw new Error("Book not found");

  return book;
};

// List Books

export const listBooks = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    title,
    author,
    genre,
    available,
    sortBy = "createdAt",
    order = "desc",
  } = options;

  const skip = (page - 1) * limit;

  // Build filters
  const filter = {};
  if (title) filter.title = { $regex: title, $options: "i" };
  if (author) filter.author = { $regex: author, $options: "i" };
  if (genre) filter.genre = { $regex: genre, $options: "i" };
  if (available) filter.availableCopies = { $gt: 0 };

  // Sorting
  const sortOrder = order === "asc" ? 1 : -1;

  const books = await Book.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: books,
  };
};


// Get Single Book
export const getBook = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid book ID");
  }

  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  return book;
};
