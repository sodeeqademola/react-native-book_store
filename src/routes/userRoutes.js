"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_1.register);
userRouter.post("/login", user_1.login);
exports.default = userRouter;
