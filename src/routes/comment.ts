import express from 'express';
import { create, getByPost, remove } from '../controllers/comment';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/post/:postId/comments', getByPost);
router.post('/post/:postId/comments', authenticate, create);
router.delete('/comments/:id', authenticate, remove);

export default router;
