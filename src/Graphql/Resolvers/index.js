import { userResolver } from "./userResolver.js";
import { bookResolver } from "./bookResolver.js";
import { borrowResolver } from "./borrowResolver.js";
import { reportResolver } from "./reportResolver.js";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...bookResolver.Query,
    ...borrowResolver.Query,
    ...reportResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...bookResolver.Mutation,
    ...borrowResolver.Mutation,
  },
};
