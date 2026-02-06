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
const { createComment, getCommentsByPost, deleteComment } = await Promise.resolve().then(() => __importStar(require('../../src/services/comment.js')));
describe('Comment Service', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    describe('createComment', () => {
        it('should create a new comment', async () => {
            const mockPost = { id: 'post-1', title: 'Post' };
            const mockComment = {
                id: 'comment-1',
                content: 'Great post!',
                postId: 'post-1',
                authorId: 'user-1',
                author: {
                    id: 'user-1',
                    name: 'Commenter',
                    email: 'commenter@example.com'
                }
            };
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(mockPost);
            prisma_mock_js_1.default.comment.create.mockResolvedValue(mockComment);
            const result = await createComment('post-1', 'user-1', 'Great post!');
            expect(result).toEqual(mockComment);
            expect(prisma_mock_js_1.default.comment.create).toHaveBeenCalled();
        });
        it('should throw error when post not found', async () => {
            prisma_mock_js_1.default.post.findUnique.mockResolvedValue(null);
            await expect(createComment('non-existent', 'user-1', 'Comment')).rejects.toThrow('Post not found');
        });
    });
    describe('getCommentsByPost', () => {
        it('should return comments for a post', async () => {
            const mockComments = [
                { id: 'comment-1', content: 'First comment', author: { id: 'user-1', name: 'User 1' } },
                { id: 'comment-2', content: 'Second comment', author: { id: 'user-2', name: 'User 2' } }
            ];
            prisma_mock_js_1.default.comment.findMany.mockResolvedValue(mockComments);
            const result = await getCommentsByPost('post-1');
            expect(result).toEqual(mockComments);
            expect(result.length).toBe(2);
        });
    });
    describe('deleteComment', () => {
        it('should delete own comment', async () => {
            const mockComment = { id: 'comment-1', authorId: 'user-1', content: 'Comment' };
            prisma_mock_js_1.default.comment.findUnique.mockResolvedValue(mockComment);
            prisma_mock_js_1.default.comment.delete.mockResolvedValue(mockComment);
            const result = await deleteComment('comment-1', 'user-1');
            expect(result).toEqual({
                message: 'Comment deleted successfully',
                id: 'comment-1'
            });
        });
        it('should throw error when comment not found', async () => {
            prisma_mock_js_1.default.comment.findUnique.mockResolvedValue(null);
            await expect(deleteComment('non-existent', 'user-1')).rejects.toThrow('Comment not found');
        });
        it('should throw error when user is not the author', async () => {
            const mockComment = { id: 'comment-1', authorId: 'user-1' };
            prisma_mock_js_1.default.comment.findUnique.mockResolvedValue(mockComment);
            await expect(deleteComment('comment-1', 'user-2')).rejects.toThrow('Unauthorized');
        });
    });
});
