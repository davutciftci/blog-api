import prisma from '../config/database.js';
import bcrypt from 'bcrypt';


interface CreateUserData {
    email: string;
    password: string;
    name: string;
}

interface UpdateUserData {
    password?: string;
    name?: string;
}

export const createUser = async (userData: CreateUserData) => {
    const {email, password, name} = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return user;
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('User with this email already exists');
        }
        throw error;
    }
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if(!user) {
        throw new Error('User not found')
    }
    return user;
}

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email},
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return user;
}

export const updateUser= async (id: string, updateData: UpdateUserData) => {
    const existingUser = await prisma.user.findUnique({
        where: { id }
    });

    if (!existingUser) {
        throw new Error('User not found');
    }

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return user;
}

export const deleteUser = async (id: string) => {
    const user= await prisma.user.findUnique({
        where: { id }
    });

    if(!user) {
        throw new Error ('User not found')
    };

    await prisma.user.delete({
        where: { id }
    })
    return { message: 'User deleted successfully', id };
};

interface GetAllUsersOptions {
    skip?: number;
    take?: number;
}

export const getAllUsers = async (options: GetAllUsersOptions = {}) => {
    const { skip = 0, take = 10 } = options;

    const users = await prisma.user.findMany({
        skip,
        take,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return users;
}