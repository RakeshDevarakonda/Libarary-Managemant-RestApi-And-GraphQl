import { authorizeRolesgraphql } from "../../middleware/authMiddleware.js";
import {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  getBook,
} from "../Controllers/bookController.js";

export const bookResolver = {
  Query: {
    books: async (parent, args) => {
      const result = await listBooks({
        page: args.page,
        limit: args.limit,
        title: args.title,
        author: args.author,
        genre: args.genre,
        available: args.available,
        sortBy: args.sortBy,
        order: args.order,
      });


      return result.data;
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
