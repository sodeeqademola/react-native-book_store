import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type userProps = {
  username: string;
  email: string;
  password: string;
  profileImage: string;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = <userProps>req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already existed",
      });
    }

    if (!existingUser) {
      const hashPasssword = await bcrypt.hash(password, 10);

      const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

      await User.create({
        email,
        password: hashPasssword,
        username,
        profileImage,
      });

      return res.status(201).send({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

type loginProps = {
  email: string;
  password: string;
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = <loginProps>req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "User does not exist",
      });
    }

    if (existingUser) {
      const comparePasssword = await bcrypt.compare(
        password,
        existingUser.password as string
      );

      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.SECRET_KEY as string,
        { expiresIn: "7d" }
      );

      if (!comparePasssword) {
        return res.status(400).send({
          success: false,
          message: "Incorrect Password",
        });
      }

      existingUser.password = undefined;

      if (comparePasssword) {
        return res.status(200).send({
          success: true,
          message: "Logged in Successfullly",
          user: existingUser,
          token,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while logging in",
      error,
    });
  }
};
