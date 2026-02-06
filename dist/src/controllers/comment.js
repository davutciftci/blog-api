"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.remove = exports.getByPost = exports.create = void 0;
const comment_1 = require("../services/comment");
const create = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        if (!content || content.trim().length < 2) {
            return res.status(400).json({
                error: 'Comment must be at least 2 characters long'
            });
        }
        if (typeof postId !== 'string') {
            return res.status(400).json({ error: 'Invalid postId' });
        }
        const comment = await (0, comment_1.createComment)(postId, req.user.id, content);
        res.status(201).json({ message: 'Comment created successfully', comment });
    }
    catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.create = create;
const getByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (typeof postId !== 'string') {
            return res.status(400).json({ error: 'Invalid postId' });
        }
        const comments = await (0, comment_1.getCommentsByPost)(postId);
        res.status(200).json({ comments });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getByPost = getByPost;
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id' });
        }
        const result = await (0, comment_1.deleteComment)(id, req.user.id);
        res.status(200).json({ message: 'Comment deleted successfully', result });
    }
    catch (error) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.remove = remove;
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!content || content.trim().length < 2) {
            return res.status(400).json({
                error: 'Comment must be at least 2 characters long'
            });
        }
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id' });
        }
        const comment = await (0, comment_1.updateComment)(id, req.user.id, content);
        res.status(200).json({ message: 'Comment updated successfully', comment });
    }
    catch (error) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.update = update;
