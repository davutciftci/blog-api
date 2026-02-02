import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/database.js';

describe('Comments API', () => {
  let authToken: string;
  let userId: string;
  let postId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'comment-test@example.com',
        password: 'Test1234',
        name: 'Commenter'
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    const postResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Post for Comments',
        content: 'This post will have comments'
      });

    postId = postResponse.body.post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/posts/:postId/comments', () => {
    it('should create a comment with valid token', async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Great post!'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Comment created successfully');
      expect(response.body.comment.content).toBe('Great post!');
      expect(response.body.comment.author.id).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({ content: 'Comment' })
        .expect(401);
    });

    it('should return 400 for short comment', async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'A' })
        .expect(400);

      expect(response.body.error).toContain('at least 2 characters');
    });

    it('should return 404 for non-existent post', async () => {
      const fakePostId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .post(`/api/posts/${fakePostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comment' })
        .expect(404);

      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'First comment' });

      await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Second comment' });
    });

    it('should get all comments for a post', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}/comments`)
        .expect(200);

      expect(response.body.comments).toHaveLength(2);
      expect(response.body.comments[0]).toHaveProperty('author');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    let commentId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comment to delete' });

      commentId = response.body.comment.id;
    });

    it('should delete own comment', async () => {
      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Comment deleted successfully');

      const comments = await prisma.comment.findMany();
      expect(comments.length).toBe(0);
    });

    it('should return 403 when deleting others comment', async () => {
      const otherUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'comment-other@example.com',
          password: 'Test1234',
          name: 'Other'
        });

      await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherUserRes.body.token}`)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .delete(`/api/comments/${commentId}`)
        .expect(401);
    });
  });

});