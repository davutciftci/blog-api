
import { prismaMock } from '../setup/prisma-mock.js';
import { 
  createUser, 
  getUserById, 
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers
} from '../../src/services/user.js';
import bcrypt from 'bcrypt';

// Mock'u database modülüne bağla - import'tan ÖNCE olmalı
jest.mock('../../src/config/database.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

// bcrypt'i mock'la
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;


describe('User Service', () => {

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'Test1234',
        name: 'Test User'
      };

      const mockCreatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock bcrypt.hash
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      // Mock prisma calls
      prismaMock.user.findUnique.mockResolvedValue(null); // No existing user
      prismaMock.user.create.mockResolvedValue(mockCreatedUser);

      const result = await createUser(mockUserData);

      // Assertions
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('Test1234', 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed_password',
          name: 'Test User'
        },
        select: expect.any(Object)
      });
      expect(result).toEqual(mockCreatedUser);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user already exists', async () => {
      const mockUserData = {
        email: 'existing@example.com',
        password: 'Test1234',
        name: 'Test User'
      };

      const existingUser = {
        id: '1',
        email: 'existing@example.com'
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      await expect(createUser(mockUserData)).rejects.toThrow(
        'User with this email already exists'
      );

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
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

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserById('1');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object)
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

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

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty('password');
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      };

      const updateData = {
        name: 'Updated Name'
      };

      const mockUpdatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await updateUser('1', updateData);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        select: expect.any(Object)
      });
      expect(result.name).toBe('Updated Name');
    });

    it('should hash password when updating password', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const updateData = { password: 'NewPass123' };

      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue({ ...mockUser, password: 'new_hashed_password' });

      await updateUser('1', updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123', 10);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { password: 'new_hashed_password' },
        select: expect.any(Object)
      });
    });

    it('should throw error when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(updateUser('999', { name: 'Test' })).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await deleteUser('1');

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual({
        message: 'User deleted successfully',
        id: '1'
      });
    });

    it('should throw error when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(deleteUser('999')).rejects.toThrow('User not found');
      expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return list of users with default pagination', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', email: 'user2@example.com', name: 'User 2', createdAt: new Date(), updatedAt: new Date() }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('should return users with custom pagination', async () => {
      const mockUsers = [
        { id: '3', email: 'user3@example.com', name: 'User 3', createdAt: new Date(), updatedAt: new Date() }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await getAllUsers({ skip: 10, take: 5 });

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 5,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });
  });

});