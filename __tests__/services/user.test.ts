import { jest } from '@jest/globals';
import { prismaMock } from '../setup/prisma-mock.js';

const mockHash = jest.fn();
const mockCompare = jest.fn();

jest.unstable_mockModule('bcrypt', () => ({
  hash: mockHash,
  compare: mockCompare,
}));

import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from '../../src/services/user.js';

describe('User Service - Simplified', () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  afterEach(() => {
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

      (prismaMock.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await getUserById('1');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    it('should throw error when user not found', async () => {
      (prismaMock.user.findUnique as any).mockResolvedValue(null);

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

      (prismaMock.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty('password');
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should return null when user not found', async () => {
      (prismaMock.user.findUnique as any).mockResolvedValue(null);

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

      (prismaMock.user.findUnique as any).mockResolvedValue(existingUser);
      (prismaMock.user.update as any).mockResolvedValue(updatedUser);

      const result = await updateUser(userId, updateData);

      expect(result.name).toBe('Updated Name');
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });

    it('should throw error when user not found', async () => {
      (prismaMock.user.findUnique as any).mockResolvedValue(null);

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

      (prismaMock.user.findUnique as any).mockResolvedValue(existingUser);
      (prismaMock.user.delete as any).mockResolvedValue(existingUser);

      await deleteUser(userId);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(prismaMock.user.delete).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
    });

    it('should throw error when user not found', async () => {
      (prismaMock.user.findUnique as any).mockResolvedValue(null);

      await expect(deleteUser('999')).rejects.toThrow('User not found');
    });
  });

});