import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";
import { ObjectId } from "mongodb";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: ObjectId;
    username?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

dotenv.config();

const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).send({
        success: true,
        message: "auth header is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is missing",
      });
    }

    if (token) {
      const _id = jwt.verify(token, process.env.SECRET_KEY as string);

      // find user
      const user = await User.findById(_id).select("-password");

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "There is no user",
        });
      }

      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while sending token",
    });
  }
};

export default protectedRoute;
