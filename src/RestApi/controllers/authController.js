import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { throwError } from "../../utils/throwError.js";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) throwError(400, errors.array().map(e => e.msg).join(", "));

    const { name, email, password } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) throwError(400, "Email already registered");

    // Hash password & create user
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashed });

    // Generate token

    res.status(201).json({
      success:true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err); // Pass to error-handling middleware
  }
};

export const login = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) throwError(400, errors.array().map(e => e.msg).join(", "));

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) throwError(400, "Email Not Found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throwError(400, "Password Not Matched");

    // Generate token
    const token = generateToken(user);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err); // Pass to error-handling middleware
  }
};
