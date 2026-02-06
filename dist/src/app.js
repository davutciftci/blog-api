"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const comment_1 = __importDefault(require("./routes/comment"));
dotenv_1.default.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.default);
app.use('/api/posts', post_1.default);
app.use('/api/comments', comment_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Blog API calisiyor",
        version: "1.0.0"
    });
});
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    // Don't log expected body-parser errors
    if (status >= 500) {
        console.error(err.stack);
    }
    res.status(status).json({
        error: status >= 500 ? "Something went wrong" : err.message
    });
});
exports.default = app;
