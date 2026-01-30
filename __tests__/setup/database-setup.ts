import { PrismaClient } from '@prisma/client';

// Global Prisma instance
export const prisma = new PrismaClient({
  errorFormat: 'pretty',
});

// Test cleanup function
export async function cleanDatabase() {
  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}

// Connect to database
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✓ Test database connected');
  } catch (error) {
    console.error('✗ Failed to connect to test database:', error);
    throw error;
  }
}

// Disconnect from database
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✓ Test database disconnected');
  } catch (error) {
    console.error('✗ Failed to disconnect from test database:', error);
    throw error;
  }
}

export default prisma;
