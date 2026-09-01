import express from "express";

import {
  register,
  login,
  changePassword,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.patch("/change-password", authenticate, changePassword);

export default router;