"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", userModel) || mongoose_1.default.models.User;
