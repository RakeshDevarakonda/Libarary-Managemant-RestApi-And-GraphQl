import Borrow from "../../RestApi/models/Borrow.js";
import Book from "../../RestApi/models/Book.js";

export const mostBorrowedBooks = async () => {
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
        title: "$book.title",
        author: "$book.author",
        borrowCount: 1,
      },
    },
  ];
  return await Borrow.aggregate(pipeline);
};

export const activeMembers = async () => {
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
        name: "$user.name",
        email: "$user.email",
        borrowCount: 1,
      },
    },
  ];
  return await Borrow.aggregate(pipeline);
};

export const bookAvailability = async () => {
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
    { $sort: { borrowedCount: -1 } },
  ];
  return await Book.aggregate(pipeline);
};
