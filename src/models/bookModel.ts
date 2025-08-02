import mongoose from "mongoose";

type bookSchemaProps = {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

const bookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book =
  mongoose.model<bookSchemaProps>("Book", bookModel) || mongoose.models.Book;
