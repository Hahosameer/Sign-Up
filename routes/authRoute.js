import express from "express";
import { login, signUp } from "../controller/authControlles.js";
export const authRoutes = express.Router();
authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);