import { jest } from '@jest/globals';
import mockPrisma from '../setup/prisma-mock.js';

const mockHash = jest.fn();
const mockCompare = jest.fn();

// Mock dependencies BEFORE importing services
jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: mockHash,
    compare: mockCompare,
  },
  hash: mockHash,
  compare: mockCompare,
}));

jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: mockPrisma,
}));

// Use dynamic imports for services to ensure they use mocked modules
const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} = await import('../../src/services/user.js');

describe('User Service - Simplified', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object)
      });
    });

    it('should throw error when user not found', async () => {
      (mockPrisma.user.findUnique as any).mockResolvedValue(null);

      await expect(getUserById('999')).rejects.toThrow('User not found');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user with password when found', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty('password');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Object)
      });
    });

    it('should return null when user not found', async () => {
      (mockPrisma.user.findUnique as any).mockResolvedValue(null);

      const result = await getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const updateData = { name: 'Updated Name' };
      
      const existingUser = { 
        id: userId, 
        email: 'test@example.com', 
        name: 'Old Name',
        password: 'hashedpass',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedUser = { 
        ...existingUser, 
        name: 'Updated Name',
        updatedAt: new Date()
      };

      (mockPrisma.user.findUnique as any).mockResolvedValue(existingUser);
      (mockPrisma.user.update as any).mockResolvedValue(updatedUser);

      const result = await updateUser(userId, updateData);

      expect(result.name).toBe('Updated Name');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('should throw error when user not found', async () => {
      (mockPrisma.user.findUnique as any).mockResolvedValue(null);

      await expect(updateUser('999', { name: 'Test' }))
        .rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user-123';
      
      const existingUser = { 
        id: userId, 
        email: 'test@example.com', 
        name: 'Test User',
        password: 'hashedpass',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.user.findUnique as any).mockResolvedValue(existingUser);
      (mockPrisma.user.delete as any).mockResolvedValue(existingUser);

      await deleteUser(userId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
    });

    it('should throw error when user not found', async () => {
      (mockPrisma.user.findUnique as any).mockResolvedValue(null);

      await expect(deleteUser('999')).rejects.toThrow('User not found');
    });
  });

});