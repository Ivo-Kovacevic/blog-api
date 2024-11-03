import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPosts = async (onlyPublished: boolean) => {
    try {
        const whereCondition = onlyPublished ? { status: Status.PUBLISHED } : {};
        return await prisma.post.findMany({
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
    } catch (error) {
        console.error("Error retrieving all posts: ", error);
        throw new Error("Could not retrieve posts.");
    }
};

export const getPostById = async (id: number) => {
    try {
        return await prisma.post.findUnique({
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
    } catch (error) {
        console.error("Error retrieving post by ID: ", error);
        throw new Error("Could not retrieve the post.");
    }
};

export const newPost = async (authorId: number, title: string, text: string, status: Status) => {
    try {
        return await prisma.post.create({
            data: {
                authorId,
                title,
                text,
                status,
            },
        });
    } catch (error) {
        console.error("Error creating new post: ", error);
        throw new Error("Could not create the post.");
    }
};

export const updatePost = async (id: number, title: string, text: string, status: Status) => {
    try {
        const postExists = await getPostById(id);
        if (!postExists) {
            return null;
        }
        return await prisma.post.update({
            where: {
                id,
            },
            data: {
                title,
                text,
                status,
            },
        });
    } catch (error) {
        console.error("Error updating post: ", error);
        throw new Error("Could not update the post.");
    }
};

export const deletePost = async (id: number) => {
    try {
        const postExists = await getPostById(id);
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
