import { authenticate } from '../../src/middlewares/auth.js';
import jwt from 'jsonwebtoken';
import { prismaMock } from '../setup/prisma-mock.js';

// Mock Prisma
jest.mock('../../src/config/database.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

// Mock user service
jest.mock('../../src/services/user.js', () => ({
  getUserById: jest.fn()
}));

describe('Auth Middleware - Unit Tests', () => {
  const mockRequest: any = {
    headers: {}
  };
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.headers = {};
  });

  describe('authenticate', () => {
    it('should validate a valid JWT token', async () => {
      const validToken = jwt.sign(
        { userId: 'user-1', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      mockRequest.headers.authorization = `Bearer ${validToken}`;

      await authenticate(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });

    it('should reject request without authorization header', async () => {
      await authenticate(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject malformed authorization header', async () => {
      mockRequest.headers.authorization = 'InvalidFormat';

      await authenticate(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid JWT token', async () => {
      mockRequest.headers.authorization = 'Bearer invalid.token.here';

      await authenticate(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
