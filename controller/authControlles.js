import { genSaltSync, hashSync } from "bcrypt";
import { generateToken } from "../middleware/verifyToken.js";
import User from "../models/User.js"
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user with the provided email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Check if user with the provided username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res
        .status(409)
        .json({ message: "Username already taken, kindly choose another" });
    }

    // Hash the password and create a new user
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // Remove the password before sending the response
    savedUser.password = undefined;

    // Generate token
    const token = generateToken({ data: savedUser });

    // Send the response with the token
    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
