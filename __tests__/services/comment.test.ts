import { jest } from '@jest/globals';
import mockPrisma from '../setup/prisma-mock.js';

// Mock database module BEFORE importing services
jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: mockPrisma,
}));

// Use dynamic imports for services to ensure they use mocked modules
const {
  createComment,
  getCommentsByPost,
  deleteComment
} = await import('../../src/services/comment.js');

describe('Comment Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
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

      (mockPrisma.post.findUnique as any).mockResolvedValue(mockPost);
      (mockPrisma.comment.create as any).mockResolvedValue(mockComment);

      const result = await createComment('post-1', 'user-1', 'Great post!');

      expect(result).toEqual(mockComment);
      expect(mockPrisma.comment.create).toHaveBeenCalled();
    });

    it('should throw error when post not found', async () => {
      (mockPrisma.post.findUnique as any).mockResolvedValue(null);

      await expect(
        createComment('non-existent', 'user-1', 'Comment')
      ).rejects.toThrow('Post not found');
    });
  });

  describe('getCommentsByPost', () => {
    it('should return comments for a post', async () => {
      const mockComments = [
        { id: 'comment-1', content: 'First comment', author: { id: 'user-1', name: 'User 1' } },
        { id: 'comment-2', content: 'Second comment', author: { id: 'user-2', name: 'User 2' } }
      ];

      (mockPrisma.comment.findMany as any).mockResolvedValue(mockComments);

      const result = await getCommentsByPost('post-1');

      expect(result).toEqual(mockComments);
      expect(result.length).toBe(2);
    });
  });

  describe('deleteComment', () => {
    it('should delete own comment', async () => {
      const mockComment = { id: 'comment-1', authorId: 'user-1', content: 'Comment' };

      (mockPrisma.comment.findUnique as any).mockResolvedValue(mockComment);
      (mockPrisma.comment.delete as any).mockResolvedValue(mockComment);

      const result = await deleteComment('comment-1', 'user-1');

      expect(result).toEqual({
        message: 'Comment deleted successfully',
        id: 'comment-1'
      });
    });

    it('should throw error when comment not found', async () => {
      (mockPrisma.comment.findUnique as any).mockResolvedValue(null);

      await expect(
        deleteComment('non-existent', 'user-1')
      ).rejects.toThrow('Comment not found');
    });

    it('should throw error when user is not the author', async () => {
      const mockComment = { id: 'comment-1', authorId: 'user-1' };

      (mockPrisma.comment.findUnique as any).mockResolvedValue(mockComment);

      await expect(
        deleteComment('comment-1', 'user-2')
      ).rejects.toThrow('Unauthorized');
    });
  });

});