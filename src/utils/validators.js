import { body } from "express-validator";
import { throwError } from "./throwError.js";
import mongoose from "mongoose";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

export const bookCreateValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .isString()
    .withMessage("Author must be a string"),

  body("isbn").optional().isString().withMessage("ISBN must be a string"),

  body("publicationDate")
    .isISO8601()
    .toDate()
    .withMessage(
      "Publication date must be a valid date in form of year-month-date"
    ),

  body("genre").optional().isString().withMessage("Genre must be a string"),

  body("totalCopies")
    .isInt({ min: 0 })
    .withMessage("Copies must be an integer >= 0"),
];

export const bookUpdateValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("author").optional().notEmpty().withMessage("Author cannot be empty"),
  body("isbn").optional().notEmpty().withMessage("ISBN cannot be empty"),
  body("publicationDate")
    .isISO8601()
    .toDate()
    .withMessage(
      "Publication date must be a valid date in form of year-month-date"
    ),
  body("genre").optional().notEmpty().withMessage("Genre cannot be empty"),
  body("copies")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Copies must be >= 0"),
];


export const validateObjectId = (id, name = "ID") => {
  if (!mongoose.isValidObjectId(id)) {
    throwError(400, `Invalid ${name}`);
  }
};
