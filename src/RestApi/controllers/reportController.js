import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { throwError } from "../../utils/throwError.js";


export const mostBorrowedBooks = async (req, res, next) => {
  try {


    const pipeline = [
      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          _id: 0,
          bookId: "$book._id",
          title: "$book.title",
          author: "$book.author",
          isbn: "$book.isbn",
          genre: "$book.genre",
          borrowCount: 1,
        },
      },
    ];

    const result = await Borrow.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/active-members
 * Returns top N users by number of borrows
 */
export const activeMembers = async (req, res, next) => {
  try {

    const pipeline = [
      { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          borrowCount: 1,
        },
      },
    ];

    const result = await Borrow.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const bookAvailability = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "borrows",
          localField: "_id",
          foreignField: "book",
          as: "borrows",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          totalCopies: 1,
          availableCopies: 1,
          borrowedCount: {
            $size: {
              $filter: {
                input: "$borrows",
                as: "b",
                cond: { $eq: ["$$b.status", "Borrowed"] },
              },
            },
          },
        },
      },

      {
        $sort: { borrowedCount: -1 },
      },
    ];

    const result = await Book.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
