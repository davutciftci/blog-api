"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("../../src/app.js"));
const database_js_1 = __importDefault(require("../../src/config/database.js"));
require("../setup/integration-setup.js");
describe('Comment API', () => {
    let authToken;
    let userId;
    let postId;
    beforeAll(async () => {
        // Clear database
        await database_js_1.default.comment.deleteMany();
        await database_js_1.default.post.deleteMany();
        await database_js_1.default.user.deleteMany();
        // Create user
        const userResponse = await (0, supertest_1.default)(app_js_1.default)
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
        const postResponse = await (0, supertest_1.default)(app_js_1.default)
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
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'This is a test comment'
            });
            expect(response.status).toBe(201);
            expect(response.body.comment.content).toBe('This is a test comment');
        });
        it('should return 400 for short comment', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'a'
            });
            expect(response.status).toBe(400);
        });
        it('should return 404 for non-existent post', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
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
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get(`/api/comments/post/${postId}/comments`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.comments)).toBe(true);
        });
    });
    describe('PUT /api/comments/:id', () => {
        let commentId;
        beforeAll(async () => {
            const createResponse = await (0, supertest_1.default)(app_js_1.default)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'Comment to update'
            });
            expect(createResponse.status).toBe(201);
            commentId = createResponse.body.comment.id;
        });
        it('should update own comment successfully', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .put(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'Updated comment content'
            });
            expect(response.status).toBe(200);
            expect(response.body.comment.content).toBe('Updated comment content');
        });
        it('should return 400 for short content', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .put(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'a'
            });
            expect(response.status).toBe(400);
        });
        it('should return 404 for non-existent comment', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .put('/api/comments/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'Update non-existent'
            });
            expect(response.status).toBe(404);
        });
    });
    describe('DELETE /api/comments/:id', () => {
        let commentId;
        beforeAll(async () => {
            const createResponse = await (0, supertest_1.default)(app_js_1.default)
                .post(`/api/comments/post/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                content: 'Comment to delete'
            });
            expect(createResponse.status).toBe(201);
            commentId = createResponse.body.comment.id;
        });
        it('should delete own comment successfully', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('deleted');
        });
        it('should return 404 for non-existent comment', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .delete('/api/comments/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });
});
