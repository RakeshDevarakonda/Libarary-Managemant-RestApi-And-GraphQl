
export const borrowSchema = `#graphql
  type Borrow {
    id: ID!
    user: User
    book: Book
    status: String
    borrowDate: String
    returnDate: String
  }

  type Query {
    myBorrowHistory(userId: ID!): [Borrow]
  }

  type Mutation {
    borrowBook(userId: ID!, bookId: ID!): Borrow
    returnBook(borrowId: ID!): Borrow
  }
`;
