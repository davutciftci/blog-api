import { jest } from '@jest/globals';
import { prismaMock } from '../setup/prisma-mock.js';

// Service'leri import et
import {
  createPost,
  getPostById,
  getPostBySlug,
  getAllPosts,
  updatePost,
  deletePost,
  getPostsByAuthor
} from '../../src/services/post.js';

describe('Prisma Mock Setup', () => {
  it('should initialize prisma mock', () => {
    expect(prismaMock).toBeDefined();
  });
});

describe('Post Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
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

      (prismaMock.post.findUnique as any).mockResolvedValue(null);
      (prismaMock.post.create as any).mockResolvedValue(mockCreatedPost);

      const result = await createPost(authorId, postData);

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-post-title' }
      });
      expect(prismaMock.post.create).toHaveBeenCalledWith({
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

      (prismaMock.post.findUnique as any).mockResolvedValue(existingPost);
      (prismaMock.post.create as any).mockResolvedValue({
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

      (prismaMock.post.findUnique as any).mockResolvedValue(mockPost);

      const result = await getPostById('post-1');

      expect(result).toEqual(mockPost);
      expect(result.author).toBeDefined();
      expect(result.comments).toHaveLength(1);
    });

    it('should throw error when post not found', async () => {
      (prismaMock.post.findUnique as any).mockResolvedValue(null);

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

      (prismaMock.post.findMany as any).mockResolvedValue(mockPosts);

      const result = await getAllPosts();

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockPosts);
    });

    it('should filter by published status', async () => {
      (prismaMock.post.findMany as any).mockResolvedValue([]);

      await getAllPosts({ published: true });

      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true }
        })
      );
    });

    it('should filter by author', async () => {
      (prismaMock.post.findMany as any).mockResolvedValue([]);

      await getAllPosts({ authorId: 'user-1' });

      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { authorId: 'user-1' }
        })
      );
    });
  });

  describe('updatePost', () => {
    it('should update post when user is author', async () => {
      const postId = 'post-1';
      const authorId = 'user-1';
      const updateData = { title: 'Updated Title', content: 'Updated content' };

      const mockPost = { id: postId, authorId, title: 'Old Title', slug: 'old-title', content: 'old', published: false, createdAt: new Date(), updatedAt: new Date() };
      const mockUpdatedPost = { ...mockPost, ...updateData, slug: 'updated-title' };

      (prismaMock.post.findUnique as any).mockResolvedValue(mockPost);
      (prismaMock.post.update as any).mockResolvedValue(mockUpdatedPost);

      const result = await updatePost(postId, authorId, updateData);

      expect(result.title).toBe('Updated Title');
      expect(result.slug).toBe('updated-title');
    });

    it('should throw error when user is not the author', async () => {
      const mockPost = { id: 'post-1', authorId: 'user-1', title: 'Post', slug: 'post', content: 'content', published: false, createdAt: new Date(), updatedAt: new Date() };

      (prismaMock.post.findUnique as any).mockResolvedValue(mockPost);

      await expect(
        updatePost('post-1', 'user-2', { title: 'Hack' })
      ).rejects.toThrow('Unauthorized to update this post');
    });

    it('should throw error when post not found', async () => {
      (prismaMock.post.findUnique as any).mockResolvedValue(null);

      await expect(
        updatePost('non-existent', 'user-1', {})
      ).rejects.toThrow('Post not found');
    });
  });

  describe('deletePost', () => {
    it('should delete post when user is author', async () => {
      const mockPost = { id: 'post-1', authorId: 'user-1', title: 'Post', slug: 'post', content: 'content', published: false, createdAt: new Date(), updatedAt: new Date() };

      (prismaMock.post.findUnique as any).mockResolvedValue(mockPost);
      (prismaMock.post.delete as any).mockResolvedValue(mockPost);

      const result = await deletePost('post-1', 'user-1');

      expect(prismaMock.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' }
      });
      expect(result).toEqual({
        message: 'Post deleted successfully',
        id: 'post-1'
      });
    });

    it('should throw error when user is not the author', async () => {
      const mockPost = { id: 'post-1', authorId: 'user-1', title: 'Post', slug: 'post', content: 'content', published: false, createdAt: new Date(), updatedAt: new Date() };

      (prismaMock.post.findUnique as any).mockResolvedValue(mockPost);

      await expect(
        deletePost('post-1', 'user-2')
      ).rejects.toThrow('Unauthorized to delete this post');

      expect(prismaMock.post.delete).not.toHaveBeenCalled();
    });
  });

  describe('getPostsByAuthor', () => {
    it('should return posts by specific author', async () => {
      const mockPosts = [
        { id: 'post-1', authorId: 'user-1', title: 'Post 1', slug: 'post-1', content: 'content1', published: true, author: { id: 'user-1', name: 'User 1', email: 'user1@test.com', password: 'hash', createdAt: new Date(), updatedAt: new Date() }, comments: [], createdAt: new Date(), updatedAt: new Date() },
        { id: 'post-2', authorId: 'user-1', title: 'Post 2', slug: 'post-2', content: 'content2', published: true, author: { id: 'user-1', name: 'User 1', email: 'user1@test.com', password: 'hash', createdAt: new Date(), updatedAt: new Date() }, comments: [], createdAt: new Date(), updatedAt: new Date() }
      ];

      (prismaMock.post.findMany as any).mockResolvedValue(mockPosts);

      const result = await getPostsByAuthor('user-1');

      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { authorId: 'user-1' }
        })
      );
      expect(result).toEqual(mockPosts);
    });
  });

});