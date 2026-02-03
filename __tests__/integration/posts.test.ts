import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/database.js';
import '../setup/integration-setup.js';

describe('Posts API Integration Tests', () => {
  let authToken: string = '';
  let userId: string = '';

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'posts-final@example.com',
        password: 'Test1234',
        name: 'Posts User'
      });
    expect(registerResponse.status).toBe(201);
    
    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
    
  });

  afterAll(async () => {
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid token', async () => {
      const postData = {
        title: 'Test Post Title',
        content: 'This is a test post content with enough characters',
        published: true
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Post created successfully');
      expect(response.body).toHaveProperty('post');
      expect(response.body.post.title).toBe('Test Post Title');
      expect(response.body.post.slug).toBe('test-post-title');
      expect(response.body.post.published).toBe(true);
      expect(response.body.post.authorId).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Content here'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication required');
    });

    it('should return 400 for short title', async () => {
      const postData = {
        title: 'Ab',
        content: 'This is content'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body.error).toContain('Title must be');
    });

    it('should return 400 for short content', async () => {
      const postData = {
        title: 'Good Title',
        content: 'Short'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body.error).toContain('Content must be');
    });
  });

  describe('GET /api/posts', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Published Post 1',
          content: 'Content for published post 1',
          published: true
        });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Published Post 2',
          content: 'Content for published post 2',
          published: true
        });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Draft Post',
          content: 'Content for draft post',
          published: false
        });
    });

    it('should get all posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts.length).toBe(3);
    });

    it('should filter published posts', async () => {
      const response = await request(app)
        .get('/api/posts?published=true')
        .expect(200);

      expect(response.body.posts.length).toBe(2);
      expect(response.body.posts.every((p: any) => p.published)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/posts?page=1&limit=2')
        .expect(200);

      expect(response.body.posts.length).toBe(2);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 2);
    });
  });

  describe('GET /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Single Post',
          content: 'Content for single post'
        });

      postId = response.body.post.id;
    });

    it('should get post by id', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}`)
        .expect(200);

      expect(response.body).toHaveProperty('post');
      expect(response.body.post.id).toBe(postId);
      expect(response.body.post.title).toBe('Single Post');
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/posts/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Post not found');
    });
  });

  
  describe('PUT /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original content'
        });

      postId = response.body.post.id;
    });

    it('should update own post', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        published: true
      };

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.post.title).toBe('Updated Title');
      expect(response.body.post.content).toBe('Updated content');
      expect(response.body.post.published).toBe(true);
      expect(response.body.post.slug).toBe('updated-title');
    });

    it('should return 403 when updating others post', async () => {
      const otherUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'other@example.com',
          password: 'Test1234',
          name: 'Other User'
        });
      expect(otherUserResponse.status).toBe(201);

      const otherToken = otherUserResponse.body.token;

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked Title' })
        .expect(403);

      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send({ title: 'New Title' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication required');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let postId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post to Delete',
          content: 'This post will be deleted'
        });

      postId = response.body.post.id;
      
    });

    it('should delete own post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Post deleted successfully');

      const posts = await prisma.post.findMany();
      expect(posts.length).toBe(0);
    });

    it('should return 403 when deleting others post', async () => {
      const otherUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'other@example.com',
          password: 'Test1234',
          name: 'Other User'
        });
      expect(otherUserResponse.status).toBe(201);

      const otherToken = otherUserResponse.body.token;

      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.error).toContain('Unauthorized');

      const posts = await prisma.post.findMany();
      expect(posts.length).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication required');
    });
  });

});