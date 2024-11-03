var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
export const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                posts: true,
                comments: true,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
export const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findFirst({
            where: {
                username: username,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
export const registerUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield getUserByUsername(username);
        if (existingUser) {
            return "Username is taken";
        }
        return yield prisma.user.create({
            data: {
                username: username,
                password: password,
            },
        });
    }
    catch (error) {
        console.error("Error while registering user: ", error);
        throw error;
    }
});
export const userToAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.update({
            where: {
                id: id,
            },
            data: {
                role: Role.ADMIN,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
export const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findMany();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
export const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield getUserById(id);
        if (!userExists) {
            return null;
        }
        return yield prisma.user.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
export const updateUser = (id, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usernameTaken = yield getUserByUsername(username);
        if (usernameTaken) {
            return null;
        }
        return yield prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username,
                password,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
//# sourceMappingURL=userQueries.js.map