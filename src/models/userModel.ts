import mongoose from "mongoose";

type UserProps = {
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  profileImage?: string;
  updatedAt?: Date;
};

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.model<UserProps>("User", userModel) || mongoose.models.User;
