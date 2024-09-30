const { PrismaClient, Role, Status } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (onlyPublished) => {
    try {
        const whereCondition = onlyPublished ? { status: Status.PUBLISHED } : {};
        return await prisma.post.findMany({
            where: whereCondition,
            include: {
                comments: true,
            },
        });
    } catch (error) {
        console.error("Error retrieving all posts: ", error);
        throw new Error("Could not retrieve posts.");
    }
};

exports.getPostById = async (id) => {
    try {
        return await prisma.post.findUnique({
            where: {
                id: id,
            },
            include: {
                comments: true,
            },
        });
    } catch (error) {
        console.error("Error retrieving post by ID: ", error);
        throw new Error("Could not retrieve the post.");
    }
};

exports.newPost = async (authorId, title, content, status) => {
    try {
        return await prisma.post.create({
            data: {
                authorId,
                title,
                content,
                status,
            },
        });
    } catch (error) {
        console.error("Error creating new post: ", error);
        throw new Error("Could not create the post.");
    }
};

exports.updatePost = async (id, title, content, status) => {
    try {
        const postExists = await exports.getPostById(id);
        if (!postExists) {
            return null;
        }
        return await prisma.post.update({
            where: {
                id,
            },
            data: {
                title,
                content,
                status,
            },
        });
    } catch (error) {
        console.error("Error updating post: ", error);
        throw new Error("Could not update the post.");
    }
};

exports.deletePost = async (id) => {
    try {
        const postExists = await exports.getPostById(id);
        if (!postExists) {
            return null;
        }
        return await prisma.post.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Error deleting post: ", error);
        throw new Error("Could not delete the post.");
    }
};
