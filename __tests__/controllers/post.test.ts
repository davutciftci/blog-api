import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../setup/prisma-mock.js';
import postRoutes from '../../src/routes/post.js';
import jwt from 'jsonwebtoken';

// Mock Prisma
jest.mock('../../src/config/database.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

describe('Post Controller - Unit Tests', () => {
  let app: Express;
  let mockToken: string;
  const mockUserId = 'user-1';

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Create mock auth token
    mockToken = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '7d'
    });

    app.use('/posts', postRoutes);
  });

  describe('POST /posts/create', () => {
    it('should create a new post successfully', async () => {
      const newPost = {
        title: 'My First Post',
        content: 'This is the content of my first post',
        published: true
      };

      const mockCreatedPost = {
        id: 'post-1',
        title: 'My First Post',
        slug: 'my-first-post',
        content: 'This is the content of my first post',
        published: true,
        authorId: mockUserId,
        author: {
          id: mockUserId,
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.post.findUnique.mockResolvedValue(null);
      prismaMock.post.create.mockResolvedValue(mockCreatedPost);

      const response = await request(app)
        .post('/posts/create')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.post).toEqual(expect.objectContaining({
        title: newPost.title,
        slug: 'my-first-post',
        published: true
      }));
    });

    it('should reject creation without authentication', async () => {
      const newPost = {
        title: 'My First Post',
        content: 'This is the content of my first post',
        published: true
      };

      const response = await request(app)
        .post('/posts/create')
        .send(newPost);

      expect(response.status).toBe(401);
    });

    it('should reject post with missing title', async () => {
      const invalidPost = {
        content: 'This is the content of my post',
        published: true
      };

      const response = await request(app)
        .post('/posts/create')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidPost);

      expect(response.status).toBe(400);
    });

    it('should reject post with empty content', async () => {
      const invalidPost = {
        title: 'My Post',
        content: '',
        published: true
      };

      const response = await request(app)
        .post('/posts/create')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidPost);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /posts', () => {
    it('should get all published posts', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Post One',
          slug: 'post-one',
          content: 'Content one',
          published: true,
          authorId: 'user-1',
          author: {
            id: 'user-1',
            name: 'User One',
            email: 'user1@example.com'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'post-2',
          title: 'Post Two',
          slug: 'post-two',
          content: 'Content two',
          published: true,
          authorId: 'user-2',
          author: {
            id: 'user-2',
            name: 'User Two',
            email: 'user2@example.com'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      prismaMock.post.findMany.mockResolvedValue(mockPosts);

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.posts).toHaveLength(2);
      expect(response.body.posts[0].title).toBe('Post One');
    });

    it('should return empty array when no posts exist', async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body.posts).toEqual([]);
    });
  });

  describe('GET /posts/:slug', () => {
    it('should get a post by slug', async () => {
      const mockPost = {
        id: 'post-1',
        title: 'My Great Post',
        slug: 'my-great-post',
        content: 'This is a great post',
        published: true,
        authorId: 'user-1',
        author: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.post.findUnique.mockResolvedValue(mockPost);

      const response = await request(app)
        .get('/posts/my-great-post');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.post).toEqual(expect.objectContaining({
        title: 'My Great Post',
        slug: 'my-great-post'
      }));
    });

    it('should return 404 for non-existent slug', async () => {
      prismaMock.post.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/posts/non-existent-slug');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update a post successfully', async () => {
      const postId = 'post-1';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        published: false
      };

      const mockUpdatedPost = {
        id: postId,
        title: 'Updated Title',
        slug: 'updated-title',
        content: 'Updated content',
        published: false,
        authorId: mockUserId,
        author: {
          id: mockUserId,
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.post.findUnique.mockResolvedValue(mockUpdatedPost);
      prismaMock.post.update.mockResolvedValue(mockUpdatedPost);

      const response = await request(app)
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.post.title).toBe('Updated Title');
    });

    it('should reject update without authentication', async () => {
      const postId = 'post-1';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent post', async () => {
      const postId = 'non-existent';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      prismaMock.post.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post successfully', async () => {
      const postId = 'post-1';

      const mockPost = {
        id: postId,
        title: 'Post to Delete',
        slug: 'post-to-delete',
        content: 'Content',
        published: true,
        authorId: mockUserId,
        author: {
          id: mockUserId,
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.post.findUnique.mockResolvedValue(mockPost);
      prismaMock.post.delete.mockResolvedValue(mockPost);

      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject delete without authentication', async () => {
      const postId = 'post-1';

      const response = await request(app)
        .delete(`/posts/${postId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent post', async () => {
      const postId = 'non-existent';

      prismaMock.post.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
    });
  });
});
