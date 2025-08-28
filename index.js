import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import restRouter from "./src/RestApi/routes/RestRoutes.js";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./src/Graphql/Schema/index.js";
import { resolvers } from "./src/Graphql/Resolvers/index.js";
import User from "./src/models/User.js";

import jwt from "jsonwebtoken";
const app = express();
const PORT = process.env.PORT_RESTAPI;

connectDB();

app.use(helmet());

app.use(cors());
app.use(express.json());

app.use("/restapi", restRouter);

app.get("/", (req, res) => res.send("Nalanda Library API is running"));

app.use(errorHandler);

const server = new ApolloServer({ typeDefs, resolvers });


const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT_GRAPHQL },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    let user = null;

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select("-password");
      } catch (err) {
        console.log("JWT error:", err.message);
      }
    }

    return { user }; // resolvers can access context.user
  },
});

console.log(`🚀 GraphQL Server ready at: ${url}`);

app.listen(PORT, () => {
  console.log(`🚀 RestApi Server running on port ${PORT}`);
});
