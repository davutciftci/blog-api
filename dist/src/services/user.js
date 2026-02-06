"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.createUser = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (userData) => {
    const { email, password, name } = userData;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        const user = await database_js_1.default.user.create({
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
        });
        return user;
    }
    catch (error) {
        if (error.code === 'P2002') {
            throw new Error('User with this email already exists');
        }
        throw error;
    }
};
exports.createUser = createUser;
const getUserById = async (id) => {
    const user = await database_js_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    const user = await database_js_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const updateUser = async (id, updateData) => {
    const existingUser = await database_js_1.default.user.findUnique({
        where: { id }
    });
    if (!existingUser) {
        throw new Error('User not found');
    }
    if (updateData.password) {
        updateData.password = await bcrypt_1.default.hash(updateData.password, 10);
    }
    const user = await database_js_1.default.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return user;
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const user = await database_js_1.default.user.findUnique({
        where: { id }
    });
    if (!user) {
        throw new Error('User not found');
    }
    ;
    await database_js_1.default.user.delete({
        where: { id }
    });
    return { message: 'User deleted successfully', id };
};
exports.deleteUser = deleteUser;
const getAllUsers = async (options = {}) => {
    const { skip = 0, take = 10 } = options;
    const users = await database_js_1.default.user.findMany({
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
    });
    return users;
};
exports.getAllUsers = getAllUsers;
