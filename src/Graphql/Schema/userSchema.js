import gql from "graphql-tag";

export const userSchema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    registerUser(
      name: String!
      email: String!
      password: String!
      role: String
    ): User
    loginUser(email: String!, password: String!): AuthPayload
  }
`;
