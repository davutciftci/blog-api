import { getProfile, login, register } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";
import express from "express";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;
