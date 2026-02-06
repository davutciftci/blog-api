"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const prisma_mock_js_1 = __importDefault(require("../setup/prisma-mock.js"));
// Mock database module BEFORE importing services
globals_1.jest.unstable_mockModule('../../src/config/database.js', () => ({
    default: prisma_mock_js_1.default,
}));
// Use dynamic imports for services to ensure they use mocked modules
const { createPost, getPostById, getPostBySlug, getAllPosts, updatePost, deletePost, getPostsByAuthor } = await Promise.resolve().then(() => __importStar(require('../../src/services/post.js')));
describe('Post Service', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    describe('createPost', () => {
        it('should create a new post with generated slug', async () => {
            const authorId = 'user-1';
            const postData = {
                title: 'Test Post Title',
                content: 'This is test content',
                published: true
            };
            const mockCreatedPost = {
                id: 'post-1',
                title: 'Test Post Title',
                slug: 'test-post-title',
                content: 'This is test content',
                published: true,
                authorId,
                author: {
                    id: authorId,
                    name: 'Test User',
                    email: 'test@example.com'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(null);
            prisma_mock_js_1.default.post.create.mockResolvedValue(mockCreatedPost);
            const result = await createPost(authorId, postData);
            expect(prisma_mock_js_1.default.post.findUnique).toHaveBeenCalledWith({
                where: { slug: 'test-post-title' }
            });
            expect(prisma_mock_js_1.default.post.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    title: 'Test Post Title',
                    slug: 'test-post-title',
                    content: 'This is test content',
                    published: true,
                    authorId
                }),
                include: expect.any(Object)
            });
            expect(result).toEqual(mockCreatedPost);
        });
        it('should create unique slug if slug already exists', async () => {
            const authorId = 'user-1';
            const postData = {
                title: 'Duplicate Title',
                content: 'Content'
            };
            const existingPost = { id: 'post-1', slug: 'duplicate-title' };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(existingPost);
            prisma_mock_js_1.default.post.create.mockResolvedValue({
                ...postData,
                id: 'post-2',
                slug: 'duplicate-title-1234567890',
                authorId
            });
            const result = await createPost(authorId, postData);
            expect(result.slug).toContain('duplicate-title-');
            expect(result.slug).not.toBe('duplicate-title');
        });
    });
    describe('getPostById', () => {
        it('should return post with author and comments', async () => {
            const mockPost = {
                id: 'post-1',
                title: 'Test Post',
                slug: 'test-post',
                content: 'Content',
                published: true,
                authorId: 'user-1',
                author: {
                    id: 'user-1',
                    name: 'Test User',
                    email: 'test@example.com'
                },
                comments: [
                    {
                        id: 'comment-1',
                        content: 'Great post!',
                        author: { id: 'user-2', name: 'Commenter' }
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(mockPost);
            const result = await getPostById('post-1');
            expect(result).toEqual(mockPost);
            expect(result.author).toBeDefined();
            expect(result.comments).toHaveLength(1);
        });
        it('should throw error when post not found', async () => {
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(null);
            await expect(getPostById('non-existent')).rejects.toThrow('Post not found');
        });
    });
    describe('getAllPosts', () => {
        it('should return all posts with default pagination', async () => {
            const mockPosts = [
                {
                    id: 'post-1',
                    title: 'Post 1',
                    slug: 'post-1',
                    content: 'content1',
                    published: true,
                    authorId: 'user-1',
                    author: { id: 'user-1', name: 'User 1', email: 'user1@test.com', password: 'hash', createdAt: new Date(), updatedAt: new Date() },
                    comments: [],
                    _count: { comments: 5 },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 'post-2',
                    title: 'Post 2',
                    slug: 'post-2',
                    content: 'content2',
                    published: true,
                    authorId: 'user-2',
                    author: { id: 'user-2', name: 'User 2', email: 'user2@test.com', password: 'hash', createdAt: new Date(), updatedAt: new Date() },
                    comments: [],
                    _count: { comments: 2 },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            prisma_mock_js_1.default.post.findMany.mockResolvedValue(mockPosts);
            const result = await getAllPosts();
            expect(prisma_mock_js_1.default.post.findMany).toHaveBeenCalledWith({
                where: {},
                skip: 0,
                take: 10,
                include: expect.any(Object),
                orderBy: { createdAt: 'desc' }
            });
            expect(result).toEqual(mockPosts);
        });
    });
    describe('updatePost', () => {
        it('should update post when user is author', async () => {
            const postId = 'post-1';
            const authorId = 'user-1';
            const updateData = { title: 'Updated Title', content: 'Updated content' };
            const mockPost = { id: postId, authorId, title: 'Old Title', slug: 'old-title', content: 'old', published: false, createdAt: new Date(), updatedAt: new Date() };
            const mockUpdatedPost = { ...mockPost, ...updateData, slug: 'updated-title' };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(mockPost);
            prisma_mock_js_1.default.post.update.mockResolvedValue(mockUpdatedPost);
            const result = await updatePost(postId, authorId, updateData);
            expect(result.title).toBe('Updated Title');
            expect(result.slug).toBe('updated-title');
        });
        it('should throw error when user is not the author', async () => {
            const mockPost = { id: 'post-1', authorId: 'user-1', title: 'Post', slug: 'post', content: 'content', published: false, createdAt: new Date(), updatedAt: new Date() };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(mockPost);
            await expect(updatePost('post-1', 'user-2', { title: 'Hack' })).rejects.toThrow('Unauthorized to update this post');
        });
    });
    describe('deletePost', () => {
        it('should delete post when user is author', async () => {
            const mockPost = { id: 'post-1', authorId: 'user-1', title: 'Post', slug: 'post', content: 'content', published: false, createdAt: new Date(), updatedAt: new Date() };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(mockPost);
            prisma_mock_js_1.default.post.delete.mockResolvedValue(mockPost);
            const result = await deletePost('post-1', 'user-1');
            expect(prisma_mock_js_1.default.post.delete).toHaveBeenCalledWith({
                where: { id: 'post-1' }
            });
            expect(result).toEqual({
                message: 'Post deleted successfully',
                id: 'post-1'
            });
        });
    });
});
