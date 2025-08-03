"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const connection_1 = __importDefault(require("./connection"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb" }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
// dotenv
dotenv_1.default.config();
// connect to database
(0, connection_1.default)();
// routers
app.use("/api", userRoutes_1.default);
app.use("/api", bookRoutes_1.default);
app.use("/", (req, res) => {
    res.status(201).send({
        success: true,
        message: "welcome to index page",
    });
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    return console.log("connected  to port " + PORT);
});
