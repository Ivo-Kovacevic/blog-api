var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getAllComments = (_a, limit_1, skip_1) => __awaiter(void 0, [_a, limit_1, skip_1], void 0, function* ({ postId, userId }, limit, skip) {
    try {
        const filter = {};
        if (postId) {
            filter.postId = postId;
        }
        if (userId) {
            filter.authorId = userId;
        }
        const totalCount = yield prisma.comment.count({
            where: filter,
        });
        const comments = yield prisma.comment.findMany({
            where: filter,
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: skip,
            take: limit,
        });
        return { comments, totalCount };
    }
    catch (error) {
        console.error("Error retrieving comments: ", error);
        throw new Error("Could not retrieve the comments.");
    }
});
export const getCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.comment.findUnique({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error("Error retrieving comment by ID: ", error);
        throw new Error("Could not retrieve the comment.");
    }
});
export const newComment = (authorId, postId, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.comment.create({
            data: {
                text,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                post: {
                    connect: {
                        id: postId,
                    },
                },
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
        console.error("Error creating new comment: ", error);
        throw new Error("Could not create the comment.");
    }
});
export const updateComment = (id, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentExists = yield getCommentById(id);
        if (!commentExists) {
            return null;
        }
        return yield prisma.comment.update({
            where: {
                id,
            },
            data: {
                text,
            },
        });
    }
    catch (error) {
        console.error("Error updating comment: ", error);
        throw new Error("Could not update the comment.");
    }
});
export const deleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentExists = yield getCommentById(id);
        if (!commentExists) {
            return null;
        }
        return yield prisma.comment.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error("Error deleting comment: ", error);
        throw new Error("Could not delete the comment.");
    }
});
//# sourceMappingURL=commentQueries.js.map