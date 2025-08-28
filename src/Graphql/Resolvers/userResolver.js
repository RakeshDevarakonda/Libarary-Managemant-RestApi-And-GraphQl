import { registerUser, loginUser, getAllUsers, getUserById } from "../controllers/userController.js";

export const userResolver = {
  Query: {
    users: async () => await getAllUsers(),
    user: async (_, { id }) => await getUserById(id),
  },
  Mutation: {
    registerUser: async (_, { name, email, password, role }) => await registerUser({ name, email, password, role }),
    loginUser: async (_, { email, password }) => await loginUser({ email, password }),
  },
};
