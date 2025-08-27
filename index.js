import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import restRouter from "./src/RestApi/routes/RestRoutes.js";
import graphqlRouter from "./src/Graphql/routes/GraphqlRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());

app.use(cors());
app.use(express.json());

app.use("/restapi", restRouter);
app.use("/grapqlapi", graphqlRouter);

app.get("/", (req, res) => res.send("Nalanda Library API is running"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
