import mongoose from "mongoose";
import Borrow from "../../RestApi/models/Borrow.js";
import Book from "../../RestApi/models/Book.js";

// Borrow a book
export const borrowBook = async ({ userId, bookId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user ID");
  if (!mongoose.Types.ObjectId.isValid(bookId))
    throw new Error("Invalid book ID");

  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");
  if (book.availableCopies <= 0) throw new Error("Book not available");

  const activeBorrow = await Borrow.findOne({
    user: userId,
    book: bookId,
    status: "Borrowed",
  });
  if (activeBorrow) throw new Error("You have already borrowed this book");

  let borrow = await Borrow.create({
    user: userId,
    book: bookId,
    borrowDate: new Date(),
    status: "Borrowed",
  });

  // populate user and book
  borrow = await borrow.populate("user book");

  // decrement available copies
  book.availableCopies -= 1;
  await book.save();

  return {
    ...borrow._doc,
    id: borrow._id.toString(),
    user: {
      ...borrow.user._doc,
      id: borrow.user._id.toString(),
    },
    book: {
      ...borrow.book._doc,
      id: borrow.book._id.toString(),
    },
  };
};

// Return a book
export const returnBook = async ({ borrowId }) => {
  if (!mongoose.Types.ObjectId.isValid(borrowId))
    throw new Error("Invalid borrow ID");

  // Find the borrow record
  let borrow = await Borrow.findById(borrowId).populate("book user");
  if (!borrow) throw new Error("Borrow record not found");
  if (borrow.status !== "Borrowed") throw new Error("Book already returned");

  // Update borrow status and return date
  borrow.status = "Returned";
  borrow.returnDate = new Date();
  await borrow.save();

  // Increment available copies in the book
  borrow.book.availableCopies += 1;
  await borrow.book.save();

  return {
    ...borrow._doc,
    id: borrow._id.toString(),
    user: {
      ...borrow.user._doc,
      id: borrow.user._id.toString(),
    },
    book: {
      ...borrow.book._doc,
      id: borrow.book._id.toString(),
    },
  };
};

// Get borrow history for a user
export const myBorrowHistory = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user ID");

  const history = await Borrow.find({ user: userId })
    .populate("book").populate('user')
    .sort({ borrowDate: -1 });

  return history.map((borrow) => ({
    ...borrow._doc,
    id: borrow._id.toString(),
    user: {
      ...borrow.user._doc,
      id: borrow.user._id.toString(),
    },
    book: {
      ...borrow.book._doc,
      id: borrow.book._id.toString(),
    },
  }));
};
