import gql from "graphql-tag";

export const reportSchema = gql`
  type BorrowReport {
    title: String
    author: String
    borrowCount: Int
  }

  type MemberReport {
    name: String
    email: String
    borrowCount: Int
  }

  type BookAvailability {
    title: String
    author: String
    totalCopies: Int
    availableCopies: Int
    borrowedCount: Int
  }

  type Query {
    mostBorrowedBooks: [BorrowReport]
    activeMembers: [MemberReport]
    bookAvailability: [BookAvailability]
  }
`;
