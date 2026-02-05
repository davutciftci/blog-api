import express from 'express';
import { create, getByPost, remove, update } from '../controllers/comment.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/post/:postId/comments', getByPost);
router.post('/post/:postId/comments', authenticate, create);
router.delete('/comments/:id', authenticate, remove);
router.put('/comments/:id', authenticate, update);

export default router;
