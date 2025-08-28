import {
  borrowBook,
  returnBook,
  myBorrowHistory,
} from "../Controllers/borrowController.js";

export const borrowResolver = {
  Query: {
    myBorrowHistory: async (_, { userId }, context) => {
      if (!context.user) throw new Error("Authentication required");
      return await myBorrowHistory(userId);
    },
  },
  Mutation: {
    borrowBook: async (_, { userId, bookId }, context) => {
      if (!context.user) throw new Error("Authentication required");
      const data= await borrowBook({ userId, bookId });

      return data;
    },
    returnBook: async (_,  borrowId , context) => {
      if (!context.user) throw new Error("Authentication required");
      return await returnBook(borrowId);
    },
  },
};
