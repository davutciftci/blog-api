import express from 'express';
import {
  create,
  getAll,
  getOne,
  update,
  remove
} from '../controllers/post';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);

router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;