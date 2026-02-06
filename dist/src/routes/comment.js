"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_js_1 = require("../controllers/comment.js");
const auth_js_1 = require("../middlewares/auth.js");
const router = express_1.default.Router();
router.get('/post/:postId/comments', comment_js_1.getByPost);
router.post('/post/:postId/comments', auth_js_1.authenticate, comment_js_1.create);
router.delete('/comments/:id', auth_js_1.authenticate, comment_js_1.remove);
router.put('/comments/:id', auth_js_1.authenticate, comment_js_1.update);
exports.default = router;
