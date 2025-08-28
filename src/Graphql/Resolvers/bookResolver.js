import { authorizeRolesgraphql } from "../../middleware/authMiddleware.js";
import {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  getBook,
} from "../controllers/bookController.js";

export const bookResolver = {
  Query: {
    books: async () => {
      return await listBooks();
    },

    book: async (_, { id }) => await getBook(id),
  },
  

  Mutation: {
    createBook: authorizeRolesgraphql("Admin")(async (_, args, context) => {
      if (!context.user) throw new Error("Authentication required");
      const book = await createBook(args);
      return book;
    }),

    updateBook: authorizeRolesgraphql("Admin")(
      async (_, { id, ...updates }, context) => {
        if (!context.user) throw new Error("Authentication required");
        const book = await updateBook(id, updates);
        return book;
      }
    ),

    deleteBook: authorizeRolesgraphql("Admin")(async (_, { id }, context) => {
      if (!context.user) throw new Error("Authentication required");
      const book = await deleteBook(id);
      return book;
    }),
  },
};
