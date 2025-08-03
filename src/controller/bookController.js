"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendedBooks = exports.deleteBook = exports.getBooks = exports.createBook = void 0;
const bookModel_1 = require("../models/bookModel");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
// create book
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const request = yield cloudinary_1.default.uploader.upload(image);
        const imageUrl = request.secure_url;
        const publicId = request.public_id;
        console.log(imageUrl);
        console.log(publicId);
        //    save to database
        const book = yield bookModel_1.Book.create({
            title,
            caption,
            image: imageUrl,
            rating,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        // send the response to the front end
        return res.status(200).send({
            success: true,
            message: "Book created successfully",
            book,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createBook = createBook;
// get books
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const resquest = await fetch("localhosthlihlID?page=2&limit=5")
    // const resquest = await fetch("localhosthlihlID/id=2")
    try {
        // get page and limits
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        // skip
        const skip = (page - 1) * limit;
        const Books = yield bookModel_1.Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage ");
        //   getTotalBooks
        const totalBooks = yield bookModel_1.Book.countDocuments();
        res.status(200).send({
            success: true,
            message: "Books gotten successfully",
            Books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while getting books",
        });
    }
});
exports.getBooks = getBooks;
// delete book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const book = yield bookModel_1.Book.findById(id);
        // confirm if the book exists
        if (!book) {
            return res.status(401).send({
                success: false,
                message: "The book you want to delete does not exist",
            });
        }
        //confirm if the user is the one to delete it
        if (book.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(401).send({
                success: false,
                message: "The user is not authorized to delete this boook",
            });
        }
        // delete book from data base and cloudinary
        if (book && book.user.toString() === ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
            // delete from cloudinary
            if (book.image && book.image.includes("cloudinary")) {
                const getPublicId = book.image.split("/");
                const publicId = getPublicId[getPublicId.length - 1].split(".")[0];
                yield cloudinary_1.default.uploader.destroy(publicId);
            }
            //   delete book from database
            yield bookModel_1.Book.findByIdAndDelete(id);
            return res.status(200).send({
                success: true,
                message: "Book deleted successfully",
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while deleting book",
            error,
        });
    }
});
exports.deleteBook = deleteBook;
// get recommended book
const recommendedBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const recommendedBook = yield bookModel_1.Book.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({
            createdAt: -1,
        });
        if (recommendedBook) {
            return res.status(200).send({
                success: true,
                message: "Recommended books gotten successfully",
                recommendedBook,
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while recommending book",
        });
    }
});
exports.recommendedBooks = recommendedBooks;
