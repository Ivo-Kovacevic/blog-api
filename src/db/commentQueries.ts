import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllComments = async (
    { postId, userId }: { postId: number | undefined; userId: number | undefined },
    limit: number | undefined,
    skip: number
) => {
    try {
        const filter: { postId?: number; authorId?: number } = {};
        postId ? filter.postId = postId : filter.authorId = userId;
        
        const totalCount = await prisma.comment.count({
            where: filter,
        });
        const comments = await prisma.comment.findMany({
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
            take: limit, // Take all comments if limit is undefined
        });
        return { comments, totalCount };
    } catch (error) {
        console.error("Error retrieving comments: ", error);
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
            include: {
                author: {
                    select: {
                        username: true,
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
        const commentExists = await getCommentById(id);
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
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error updating comment: ", error);
        throw new Error("Could not update the comment.");
    }
};

export const deleteComment = async (id: number) => {
    try {
        const commentExists = await getCommentById(id);
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
