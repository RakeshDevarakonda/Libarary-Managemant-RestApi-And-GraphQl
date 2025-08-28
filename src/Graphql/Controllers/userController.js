import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const saltRounds = 10;

export const registerUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    throw new Error("All fields (name, email, password, role) are required");
  }

  // Email format validation (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Password strength check (at least 6 chars, 1 number, 1 letter)
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashed = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ name, email, password: hashed, role });

  // Don’t return password
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Password incorrect");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Don’t return password
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password"); // hide password
  return users;
};

export const getUserById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("Invalid user ID");
  }
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};
