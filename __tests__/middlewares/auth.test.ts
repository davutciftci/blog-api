import { jest } from '@jest/globals';
import mockPrisma from '../setup/prisma-mock.js';

// Mock dependencies BEFORE importing services/middlewares
jest.unstable_mockModule('../../src/config/database.js', () => ({
  __esModule: true,
  default: mockPrisma,
}));

// Use dynamic imports to ensure they use mocked modules
const { authenticate } = await import('../../src/middlewares/auth.js');
const { getUserById } = await import('../../src/services/user.js');
import jwt from 'jsonwebtoken';

// Use the real service but with mocked Prisma

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
        process.env.JWT_SECRET || 'test-secret-key-for-testing',
        { expiresIn: '7d' }
      );

      mockRequest.headers.authorization = `Bearer ${validToken}`;
      
      const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User' };
      (mockPrisma.user.findUnique as any).mockResolvedValue(mockUser);

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
