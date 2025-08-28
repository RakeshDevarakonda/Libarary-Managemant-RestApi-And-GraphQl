# Nalanda Library Management System

A backend system for a library management platform called **Nalanda**, built using Node.js, Express, and MongoDB. The system provides RESTful and GraphQL APIs for user management, book management, borrowing system, and reporting.

---

## Features

### User Management
- **Registration**: Users can register with name, email, and password.
- **Login**: Users can log in with email and password.
- **Roles**: Two roles – Admin and Member. Admins have full access; Members have limited access.

### Book Management
- **Add Book** (Admin only)
- **Update Book** (Admin only)
- **Delete Book** (Admin only)
- **List Books**: Supports pagination and filtering by author, genre, etc.

### Borrowing System
- **Borrow Book**: Members can borrow a book if copies are available.
- **Return Book**: Members can return borrowed books.
- **Borrow History**: Members can view their borrowing history.

### Reports & Aggregations
- **Most Borrowed Books**
- **Active Members**
- **Book Availability**: Summary of total, borrowed, and available books.

### API Types
- **RESTful API**
- **GraphQL API**

### Security
- **JWT Authentication** for login.
- **Role-Based Access Control** for Admin and Member roles.

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **GraphQL**: Apollo Server
---

## Getting Started

### Prerequisites
- Node.js (>= 18)
- MongoDB (local or Atlas)
- npm

### Installation
1. Clone the repository:
```bash
git clone <your-repo-link>
cd nalanda-backend
Install dependencies:

npm install
# or
yarn install


Create a .env file in the root:

PORT_RESTAPI=8000
PORT_GRAPHQL=8001


MONGO_URI=mongoduri
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=20


Start the server:

npm run dev
# or
yarn dev


Server will run at: http://localhost:8000
