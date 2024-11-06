import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserById = async (id: number) => {
    try {
        return await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                _count: {
                    select: { posts: true, comments: true },
                },
            },
        });
    } catch (error) {
        console.error("Error retrieving user by ID: ", error);
        throw new Error("Could not retrieve the user.");
    }
};

export const getUserByUsername = async (username: string) => {
    try {
        return await prisma.user.findFirst({
            where: {
                username: username,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const registerUser = async (username: string, password: string) => {
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return "Username is taken";
        }
        return await prisma.user.create({
            data: {
                username: username,
                password: password,
            },
        });
    } catch (error) {
        console.error("Error while registering user: ", error);
        throw new Error("Could not make new user.");
    }
};

export const userToAdmin = async (id: number) => {
    try {
        return await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                role: Role.ADMIN,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error("Error while retrieving all users: ", error);
        throw new Error("Could not retrieve all users.");
    }
};

export const deleteUser = async (id: number) => {
    try {
        const userExists = await getUserById(id);
        if (!userExists) {
            return null;
        }
        return await prisma.user.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Error while deleting user: ", error);
        throw new Error("Could not delete user.");
    }
};

export const updateUser = async (id: number, username: string, password: string) => {
    try {
        const usernameTaken = await getUserByUsername(username);
        if (usernameTaken) {
            return null;
        }
        return await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username,
                password,
            },
        });
    } catch (error) {
        console.error("Error while updating user: ", error);
        throw new Error("Could not update user.");
    }
};
