"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const user_1 = require("../services/user");
const validators_1 = require("../utils/validators");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }
        if (!(0, validators_1.validatePassword)(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            });
        }
        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                error: 'Name must be at least 2 characters'
            });
        }
        if (name.length > 100) {
            return res.status(400).json({
                error: 'Name cannot exceed 100 characters'
            });
        }
        const user = await (0, user_1.createUser)({ email, password, name });
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    }
    catch (error) {
        if (error.message?.includes('already exists') || error.code === 'P2002') {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }
        const user = await (0, user_1.getUserByEmail)(email);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            message: 'User logged in successfully',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: 'User profile fetched successfully',
            user: req.user
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
