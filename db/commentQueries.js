const { PrismaClient, Role, Status } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCommentById = async (id) => {
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

exports.newComment = async (authorId, postId, text) => {
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

exports.updateComment = async (id, text) => {
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

exports.deleteComment = async (id) => {
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
