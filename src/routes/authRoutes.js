import express from "express";
import { signToken } from "../middleware/auth.js";
import { findUserByEmail, createUser } from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (findUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: "User with that email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10); 

  const newUser = {
    id: normalizedEmail,
    email: normalizedEmail,
    password: hashedPassword,
    profile: "User",
  };

  createUser(newUser);

  const token = signToken(newUser);

  res.status(201).json({
    token,
    user: { id: newUser.id, email: newUser.email, profile: newUser.profile },
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signToken(user);

  res.json({
    token,
    user: { id: user.id, email: user.email, profile: user.profile },
  });
});

export default router;