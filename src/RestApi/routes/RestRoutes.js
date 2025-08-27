import express from "express";
import authRoutes from "./auth.js";
import booksRoutes from "./books.js";
import borrowRoutes from "./borrow.js";
import reportRoutes from "./reports.js";

const restRouter = express.Router();

restRouter.use("/auth", authRoutes);
restRouter.use("/books", booksRoutes);
restRouter.use("/borrow", borrowRoutes);
restRouter.use("/reports", reportRoutes);

export default restRouter;
