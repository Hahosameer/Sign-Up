import express from "express";
import { signUp } from "../controller/authControlles.js";
export const authRoutes = express.Router();
authRoutes.post("/signup", signUp);