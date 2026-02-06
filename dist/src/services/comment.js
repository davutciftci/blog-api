"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.deleteComment = exports.getCommentsByPost = exports.createComment = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
const createComment = async (postId, authorId, content) => {
    const post = await database_js_1.default.post.findUnique({
        where: { id: postId }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    const comment = await database_js_1.default.comment.create({
        data: {
            content,
            authorId,
            postId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return comment;
};
exports.createComment = createComment;
const getCommentsByPost = async (postId) => {
    const comments = await database_js_1.default.comment.findMany({
        where: { postId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return comments;
};
exports.getCommentsByPost = getCommentsByPost;
const deleteComment = async (id, authorId) => {
    const comment = await database_js_1.default.comment.findUnique({
        where: { id }
    });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.authorId !== authorId) {
        throw new Error('Unauthorized to delete this comment');
    }
    await database_js_1.default.comment.delete({
        where: { id }
    });
    return { message: 'Comment deleted successfully', id };
};
exports.deleteComment = deleteComment;
const updateComment = async (id, authorId, content) => {
    const comment = await database_js_1.default.comment.findUnique({
        where: { id }
    });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.authorId !== authorId) {
        throw new Error('Unauthorized to update this comment');
    }
    const updatedComment = await database_js_1.default.comment.update({
        where: { id },
        data: { content },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return updatedComment;
};
exports.updateComment = updateComment;
