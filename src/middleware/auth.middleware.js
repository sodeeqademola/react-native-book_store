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
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
dotenv_1.default.config();
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const _id = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            // find user
            const user = yield userModel_1.User.findById(_id).select("-password");
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: "There is no user",
                });
            }
            req.user = user;
            next();
        }
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while sending token",
        });
    }
});
exports.default = protectedRoute;
