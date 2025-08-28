import { authorizeRolesgraphql } from "../../middleware/authMiddleware.js";
import {
  mostBorrowedBooks,
  activeMembers,
  bookAvailability,
} from "../Controllers/reportController.js";

export const reportResolver = {
  Query: {
    mostBorrowedBooks: authorizeRolesgraphql("Admin")(
      async (parent, args, context) => {
        if (!context.user) throw new Error("Authentication required");
        return await mostBorrowedBooks();
      }
    ),

    activeMembers: authorizeRolesgraphql("Admin")(
      async (parent, args, context) => {
        if (!context.user) throw new Error("Authentication required");
        return await activeMembers();
      }
    ),

    bookAvailability: authorizeRolesgraphql("Admin")(
      async (parent, args, context) => {
        if (!context.user) throw new Error("Authentication required");
        return bookAvailability();
      }
    ),
  },
};
