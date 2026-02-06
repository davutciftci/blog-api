"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const post_js_1 = require("../services/post.js");
const create = async (req, res) => {
    try {
        const { title, content, published } = req.body;
        if (!title || title.trim().length < 3) {
            return res.status(400).json({
                error: 'Title must be at least 3 characters'
            });
        }
        if (!content || content.trim().length < 10) {
            return res.status(400).json({
                error: 'Content must be at least 10 characters'
            });
        }
        const post = await (0, post_js_1.createPost)(req.user.id, {
            title,
            content,
            published: published || false
        });
        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.create = create;
const getAll = async (req, res) => {
    try {
        const { page = '1', limit = '10', published } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
            return res.status(400).json({
                error: 'Invalid pagination parameters'
            });
        }
        const skip = (pageNum - 1) * limitNum;
        const take = limitNum;
        const options = { skip, take };
        if (published !== undefined) {
            options.published = published === 'true';
        }
        const posts = await (0, post_js_1.getAllPosts)(options);
        res.status(200).json({
            posts,
            page: parseInt(page),
            limit: parseInt(limit),
            total: posts.length
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAll = getAll;
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const idStr = id;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const post = await (0, post_js_1.getPostById)(id);
        res.status(200).json({ post });
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getOne = getOne;
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, published } = req.body;
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (content !== undefined)
            updateData.content = content;
        if (published !== undefined)
            updateData.published = published;
        const post = await (0, post_js_1.updatePost)(id, req.user.id, updateData);
        res.status(200).json({
            message: 'Post updated successfully',
            post
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.update = update;
/**
 * Delete post
 */
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, post_js_1.deletePost)(id, req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.remove = remove;
