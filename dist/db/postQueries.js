var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();
export const getAllPosts = (onlyPublished) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whereCondition = onlyPublished ? { status: Status.PUBLISHED } : {};
        return yield prisma.post.findMany({
            where: whereCondition,
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
                comments: true,
            },
        });
    }
    catch (error) {
        console.error("Error retrieving all posts: ", error);
        throw new Error("Could not retrieve posts.");
    }
});
export const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.post.findUnique({
            where: {
                id: id,
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error("Error retrieving post by ID: ", error);
        throw new Error("Could not retrieve the post.");
    }
});
export const newPost = (authorId, title, text, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.post.create({
            data: {
                authorId,
                title,
                text,
                status,
            },
        });
    }
    catch (error) {
        console.error("Error creating new post: ", error);
        throw new Error("Could not create the post.");
    }
});
export const updatePost = (id, title, text, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postExists = yield getPostById(id);
        if (!postExists) {
            return null;
        }
        return yield prisma.post.update({
            where: {
                id,
            },
            data: {
                title,
                text,
                status,
            },
        });
    }
    catch (error) {
        console.error("Error updating post: ", error);
        throw new Error("Could not update the post.");
    }
});
export const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postExists = yield getPostById(id);
        if (!postExists) {
            return null;
        }
        return yield prisma.post.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error("Error deleting post: ", error);
        throw new Error("Could not delete the post.");
    }
});
//# sourceMappingURL=postQueries.js.map