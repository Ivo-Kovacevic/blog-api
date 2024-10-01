const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserById = async (id) => {
    try {
        return await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                posts: true,
                comments: true,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getUserByUsername = async (username) => {
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

exports.registerUser = async (username, password) => {
    try {
        const existingUser = await exports.getUserByUsername(username);
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
        throw error;
    }
};

exports.userToAdmin = async (id) => {
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

exports.getAllUsers = async () => {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteUser = async (id) => {
    try {
        const userExists = await exports.getUserById(id);
        if (!userExists) {
            return null;
        }
        return await prisma.user.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateUser = async (id, username, password) => {
    try {
        const usernameTaken = await exports.getUserByUsername(username);
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
        console.error(error);
        throw error;
    }
};
