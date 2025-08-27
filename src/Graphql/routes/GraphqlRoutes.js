import express from "express";
import authRoutes from "../../RestApi/routes/auth.js";
import booksRoutes from "../../RestApi/routes/books.js";
import borrowRoutes from "../../RestApi/routes/borrow.js";
import reportRoutes from "../../RestApi/routes/reports.js";

const graphqlRouter = express.Router();

// Mount sub-routers dynamically
graphqlRouter.use("/auth", authRoutes);
graphqlRouter.use("/books", booksRoutes);
graphqlRouter.use("/borrow", borrowRoutes);
graphqlRouter.use("/reports", reportRoutes);

export default graphqlRouter;
