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
