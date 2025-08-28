import { userSchema } from "./userSchema.js";
import { bookSchema } from "./bookSchema.js";
import { borrowSchema } from "./borrowSchema.js";
import { reportSchema } from "./reportSchema.js";

export const typeDefs = [userSchema, bookSchema, borrowSchema, reportSchema];
