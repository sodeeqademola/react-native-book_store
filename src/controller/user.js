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
exports.login = exports.register = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already existed",
            });
        }
        if (!existingUser) {
            const hashPasssword = yield bcrypt_1.default.hash(password, 10);
            const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
            yield userModel_1.User.create({
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({
                success: false,
                message: "User does not exist",
            });
        }
        if (existingUser) {
            const comparePasssword = yield bcrypt_1.default.compare(password, existingUser.password);
            const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while logging in",
            error,
        });
    }
});
exports.login = login;
