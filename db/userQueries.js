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
    } finally {
        await prisma.$disconnect();
    }
};

exports.getUserByUsername = async (username) => {
    try {
        return await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
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
    } finally {
        await prisma.$disconnect();
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
    } finally {
        await prisma.$disconnect();
    }
};

exports.getAllUsers = async () => {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
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
    } finally {
        await prisma.$disconnect();
    }
};

exports.updateUser = async (id, username) => {
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
                username: username,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};
