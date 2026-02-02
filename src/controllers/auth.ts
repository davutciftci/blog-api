import { Request, Response } from 'express';
import { createUser, getUserByEmail } from "../services/user";
import { validateEmail, validatePassword } from "../utils/validators";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name} = req.body;

        if(!validateEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            })
        }
        if(!validatePassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            })
        }

        if(!name || name.trim().length < 2) {
            return res.status(400).json({
                error: 'Name must be at least 2 characters'
            })
        }

        const user = await createUser({ email, password, name});

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        })
    } catch (error: any) {
        if(error.message?.includes('already exists') || error.code === 'P2002') {
            return res.status(409).json({ error: 'User with this email already exists' })
        }
        
        return res.status(500).json({ error: 'Internal server error'})
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email  || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            })
        }

        const user = await getUserByEmail(email);

        if(!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const {password: _, ...userWithoutPassword} = user;

        res.status(200).json({
            message: 'User logged in successfully',
            user: userWithoutPassword,
            token
        })
    } catch (error) {        
        return res.status(500).json({ error: 'Internal server error'})
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: 'User profile fetched successfully',
            user: req.user
        })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error'})
    }
}