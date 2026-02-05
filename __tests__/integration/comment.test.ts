import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/database.js';
import '../setup/integration-setup.js';
import jwt from 'jsonwebtoken';

describe('Comment API', () => {
    let authToken: string;
    let userId: string;
    let postId: string;

    beforeAll(async () => {
        // Clear database
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();

        // Create user
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'commenter@example.com',
                password: 'Password123!',
                name: 'Commenter'
            });
        expect(userResponse.status).toBe(201);
        
        authToken = userResponse.body.token;
        userId = userResponse.body.user.id;

        // Create post
        const postResponse = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Post for comments',
                content: 'Content of the post'
            });
        expect(postResponse.status).toBe(201);
        
        postId = postResponse.body.post.id;
    });

    describe('POST /api/comments/post/:postId/comments', () => {
        it('should create a comment successfully', async () => {
            const response = await request(app)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'This is a test comment'
                });
            
            expect(response.status).toBe(201);
            expect(response.body.comment.content).toBe('This is a test comment');
        });

        it('should return 400 for short comment', async () => {
            const response = await request(app)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'a'
                });
            
            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent post', async () => {
            const response = await request(app)
                .post('/api/comments/post/non-existent-post-id/comments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Comment on non-existent post'
                });
            
            expect(response.status).toBe(404);
        });
    });

    describe('GET /api/comments/post/:postId/comments', () => {
        it('should get comments for a post', async () => {
            const response = await request(app)
                .get(`/api/comments/post/${postId}/comments`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.comments)).toBe(true);
        });
    });

    describe('PUT /api/comments/:id', () => {
        let commentId: string;

        beforeAll(async () => {
            const createResponse = await request(app)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Comment to update'
                });
            expect(createResponse.status).toBe(201);
            commentId = createResponse.body.comment.id;
        });

        it('should update own comment successfully', async () => {
            const response = await request(app)
                .put(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Updated comment content'
                });
            
            expect(response.status).toBe(200);
            expect(response.body.comment.content).toBe('Updated comment content');
        });

        it('should return 400 for short content', async () => {
            const response = await request(app)
                .put(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'a'
                });
            
            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent comment', async () => {
            const response = await request(app)
                .put('/api/comments/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Update non-existent'
                });
            
            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/comments/:id', () => {
        let commentId: string;

        beforeAll(async () => {
            const createResponse = await request(app)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Comment to delete'
                });
            expect(createResponse.status).toBe(201);
            commentId = createResponse.body.comment.id;
        });

        it('should delete own comment successfully', async () => {
            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('deleted');
        });

        it('should return 404 for non-existent comment', async () => {
            const response = await request(app)
                .delete('/api/comments/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(404);
        });
    });
});