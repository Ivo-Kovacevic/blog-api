import { PrismaClient, Role, Status } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllComments = async () => {
    try {
        return await prisma.comment.findMany();
    } catch (error) {
        console.error("Error retrieving comment: ", error);
        throw new Error("Could not retrieve the comments.");
    }
};

export const getCommentById = async (id: number) => {
    try {
        return await prisma.comment.findUnique({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Error retrieving comment by ID: ", error);
        throw new Error("Could not retrieve the comment.");
    }
};

export const newComment = async (authorId: number, postId: number, text: string) => {
    try {
        return await prisma.comment.create({
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
        });
    } catch (error) {
        console.error("Error creating new comment: ", error);
        throw new Error("Could not create the comment.");
    }
};

export const updateComment = async (id: number, text: string) => {
    try {
        const commentExists = await exports.getCommentById(id);
        if (!commentExists) {
            return null;
        }
        return await prisma.comment.update({
            where: {
                id,
            },
            data: {
                text,
            },
        });
    } catch (error) {
        console.error("Error updating comment: ", error);
        throw new Error("Could not update the comment.");
    }
};

export const deleteComment = async (id: number) => {
    try {
        const commentExists = await exports.getCommentById(id);
        if (!commentExists) {
            return null;
        }
        return await prisma.comment.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Error deleting comment: ", error);
        throw new Error("Could not delete the comment.");
    }
};

export default {
    getAllComments,
    getCommentById,
    newComment,
    updateComment,
    deleteComment,
};
