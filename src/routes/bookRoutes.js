"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controller/bookController");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const bookRouter = express_1.default.Router();
bookRouter.post("/createBook", auth_middleware_1.default, bookController_1.createBook);
bookRouter.get("/getBooks", auth_middleware_1.default, bookController_1.getBooks);
bookRouter.delete("/deleteBook/:id", auth_middleware_1.default, bookController_1.deleteBook);
bookRouter.get("/recommendedBooks", auth_middleware_1.default, bookController_1.recommendedBooks);
exports.default = bookRouter;
