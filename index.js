import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import restRouter from "./src/RestApi/routes/RestRoutes.js";

import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/Graphql/Schema/index.js";
import { resolvers } from "./src/Graphql/Resolvers/index.js";
import User from "./src/models/User.js";

import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT_RESTAPI || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// REST API routes
app.use("/restapi", restRouter);

// Root endpoint
app.get("/", (req, res) => res.send("Nalanda Library API is running"));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
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

    return { user };
  },
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`
  );
});
