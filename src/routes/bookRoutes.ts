import express from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  recommendedBooks,
} from "../controller/bookController";
import protectedRoute from "../middleware/auth.middleware";

const bookRouter = express.Router();

bookRouter.post("/createBook", protectedRoute, createBook);
bookRouter.get("/getBooks", protectedRoute, getBooks);
bookRouter.delete("/deleteBook/:id", protectedRoute, deleteBook);
bookRouter.get("/recommendedBooks", protectedRoute, recommendedBooks);

export default bookRouter;
