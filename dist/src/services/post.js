"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByAuthor = exports.deletePost = exports.updatePost = exports.getAllPosts = exports.getPostBySlug = exports.getPostById = exports.createPost = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
const formatters_js_1 = require("../utils/formatters.js");
const createPost = async (authorId, postData) => {
    const { title, content, published = false } = postData;
    const slug = (0, formatters_js_1.slugify)(title);
    const existingPost = await database_js_1.default.post.findUnique({
        where: { slug }
    });
    if (existingPost) {
        const uniqueSlug = `${slug}-${Date.now()}`;
        postData.slug = uniqueSlug;
    }
    else {
        postData.slug = slug;
    }
    const post = await database_js_1.default.post.create({
        data: {
            title,
            content,
            slug: postData.slug,
            published,
            authorId
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
    return post;
};
exports.createPost = createPost;
const getPostById = async (id) => {
    const post = await database_js_1.default.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
};
exports.getPostById = getPostById;
const getPostBySlug = async (slug) => {
    const post = await database_js_1.default.post.findUnique({
        where: { slug },
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
    if (!post) {
        throw new Error('post not found');
    }
    return post;
};
exports.getPostBySlug = getPostBySlug;
const getAllPosts = async (options = {}) => {
    const { skip = 0, take = 10, published, authorId } = options;
    const where = {};
    if (published !== undefined) {
        where.published = published;
    }
    if (authorId) {
        where.authorId = authorId;
    }
    const posts = await database_js_1.default.post.findMany({
        where,
        skip,
        take,
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
    return posts;
};
exports.getAllPosts = getAllPosts;
const updatePost = async (id, authorId, updateData) => {
    const post = await database_js_1.default.post.findUnique({ where: { id } });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.authorId !== authorId) {
        throw new Error('Unauthorized to update this post');
    }
    if (updateData.title) {
        updateData.slug = (0, formatters_js_1.slugify)(updateData.title);
    }
    const updatedPost = await database_js_1.default.post.update({
        where: { id },
        data: updateData,
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
    return updatedPost;
};
exports.updatePost = updatePost;
const deletePost = async (id, authorId) => {
    const post = await database_js_1.default.post.findUnique({ where: { id } });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.authorId !== authorId) {
        throw new Error('Unauthorized to delete this post');
    }
    await database_js_1.default.post.delete({ where: { id } });
    return { message: 'Post deleted successfully', id };
};
exports.deletePost = deletePost;
const getPostsByAuthor = async (authorId, options = {}) => {
    return (0, exports.getAllPosts)({ ...options, authorId });
};
exports.getPostsByAuthor = getPostsByAuthor;
