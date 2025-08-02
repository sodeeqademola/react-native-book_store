import { Request, Response } from "express";
import { Book } from "../models/bookModel";
import { ObjectId } from "mongoose";
import cloudinary from "../lib/cloudinary";

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

// create book
export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!image) {
      return res.status(400).send({
        success: false,
        message: "Image is required",
      });
    }

    if (!image || !title || !caption || !rating) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // upload the image
    const request = await cloudinary.uploader.upload(image);
    const imageUrl = request.secure_url;
    const publicId = request.public_id;

    console.log(imageUrl);
    console.log(publicId);

    //    save to database

    const book = await Book.create({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user?._id,
    });

    // send the response to the front end

    return res.status(200).send({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log(error);
  }
};

// get books
export const getBooks = async (req: Request, res: Response) => {
  // const resquest = await fetch("localhosthlihlID?page=2&limit=5")
  // const resquest = await fetch("localhosthlihlID/id=2")

  try {
    // get page and limits
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    // skip
    const skip = (page - 1) * limit;

    const Books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage ");

    //   getTotalBooks
    const totalBooks = await Book.countDocuments();

    res.status(200).send({
      success: true,
      message: "Books gotten successfully",
      Books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting books",
    });
  }
};

// delete book
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    // confirm if the book exists
    if (!book) {
      return res.status(401).send({
        success: false,
        message: "The book you want to delete does not exist",
      });
    }

    //confirm if the user is the one to delete it

    if (book.user.toString() !== req.user?._id.toString()) {
      return res.status(401).send({
        success: false,
        message: "The user is not authorized to delete this boook",
      });
    }

    // delete book from data base and cloudinary
    if (book && book.user.toString() === req.user?._id.toString()) {
      // delete from cloudinary
      if (book.image && book.image.includes("cloudinary")) {
        const getPublicId = book.image.split("/");
        const publicId = getPublicId[getPublicId.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      //   delete book from database
      await Book.findByIdAndDelete(id);
      return res.status(200).send({
        success: true,
        message: "Book deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting book",
      error,
    });
  }
};

// get recommended book
export const recommendedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const recommendedBook = await Book.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });

    if (recommendedBook) {
      return res.status(200).send({
        success: true,
        message: "Recommended books gotten successfully",
        recommendedBook,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while recommending book",
    });
  }
};
