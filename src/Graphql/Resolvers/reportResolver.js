import {
  mostBorrowedBooks,
  activeMembers,
  bookAvailability,
} from "../controllers/reportController.js";

export const reportResolver = {
  Query: {
    mostBorrowedBooks: async (parent, args, context) => {
      if (!context.user) throw new Error("Authentication required");
      const data= await mostBorrowedBooks();
      console.log(data)
      return data;

    },

    activeMembers: async (parent, args, context) => {
      if (!context.user) throw new Error("Authentication required");
      return await activeMembers();
    },

    bookAvailability: async (parent, args, context) => {
      if (!context.user) throw new Error("Authentication required");
      return bookAvailability();
    },
  },
};
