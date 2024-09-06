import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { sign, verify } = jwt;

export const generateToken = (data) => {
  // Create a token that expires in 1 hour
  return sign({ result: data }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token) => {
  try {
    return verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

export const validateToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    try {
      const token = authorization.split(" ")[1];
      const decoded = verifyToken(token); // Reuse verifyToken method
      req.user = decoded.result;
      next();
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  } else {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};

export const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    try {
      const token = authorization.split(" ")[1];
      const decoded = verifyToken(token); // Reuse verifyToken method
      req.user = decoded.result;
    } catch (error) {
      console.error("Token check error:", error);
    }
  }

  next(); // Allow request to proceed even if token is invalid
};
