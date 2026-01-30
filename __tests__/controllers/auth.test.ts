import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../setup/prisma-mock.js';
import authRoutes from '../../src/routes/auth.js';
import { validateEmail, validatePassword } from '../../src/utils/validators.js';
import bcrypt from 'bcrypt';

// Mock Prisma
jest.mock('../../src/config/database.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('Auth Controller - Unit Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'SecurePass123',
        name: 'New User'
      };

      const mockCreatedUser = {
        id: 'user-1',
        email: 'newuser@example.com',
        name: 'New User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockCreatedUser);

      const response = await request(app)
        .post('/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toEqual(expect.objectContaining({
        email: newUser.email,
        name: newUser.name
      }));
    });

    it('should reject invalid email format', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'SecurePass123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
    });

    it('should reject weak password', async () => {
      const weakPasswordUser = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(weakPasswordUser);

      expect(response.status).toBe(400);
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: 'SecurePass123',
        name: 'Existing User'
      };

      const mockExistingUser = {
        id: 'user-2',
        email: 'existing@example.com',
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockExistingUser);

      const response = await request(app)
        .post('/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'SecurePass123'
      };

      const mockUser = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'SecurePass123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
    });

    it('should reject login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123'
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
    });

    it('should reject login with wrong password', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'WrongPassword'
      };

      const mockUser = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
    });
  });
});
