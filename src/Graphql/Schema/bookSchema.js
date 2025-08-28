import gql from "graphql-tag";

export const bookSchema = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String
    genre: String
    publicationDate: String
    totalCopies: Int
    availableCopies: Int
  }

  type Query {
    books(
      page: Int
      limit: Int
      title: String
      author: String
      genre: String
      available: Boolean
      sortBy: String
      order: String
    ): [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createBook(
      title: String!
      author: String!
      isbn: String
      genre: String
      publicationDate: String
      totalCopies: Int!
    ): Book
    updateBook(
      id: ID!
      title: String
      author: String
      isbn: String
      genre: String
      publicationDate: String
      totalCopies: Int
    ): Book
    deleteBook(id: ID!): Book
  }
`;
