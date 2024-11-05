import passport from "../config/passport.config.js";
import * as query from "../db/postQueries.js";
import { roleCheck } from "../middlewares/roleCheck.js";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { PostParams, PostDTO } from "../@types/post.js";

export const allPostsGet: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
    let onlyPublished = true;

    // Get all posts if user is ADMIN
    if (req.user && req.user.role === "ADMIN") {
        onlyPublished = false;
    }
    const posts = await query.getAllPosts(onlyPublished);
    if (!posts || posts.length === 0) {
        res.status(204).json({ message: "No post was found" });
        return;
    }
    res.status(200).json({ posts });
};

export const postGet: RequestHandler<PostParams, {}, {}, {}> = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = await query.getPostById(postId);
    if (!post) {
        res.status(404).json({ message: "Error: Post not found" });
        return;
    }
    res.status(200).json({ post });
};

// ADMIN only
export const createPostPost = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    async (req: Request<{}, {}, PostDTO, {}>, res: Response) => {
        if (!req.user) return;

        const authorId = req.user.id;
        const title = req.body.title;
        const content = req.body.text;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const newPost = await query.newPost(authorId, title, content, status);
        if (!newPost) {
            return res.status(404).json({ message: "Error: Couldn't create post" });
        }
        return res.status(201).json({ post: newPost });
    },
];

// ADMIN only
export const updatePostPut = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    async (req: Request<PostParams, {}, PostDTO, {}>, res: Response) => {
        const postId = parseInt(req.params.postId);
        const title = req.body.title;
        const content = req.body.text;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const post = await query.updatePost(postId, title, content, status);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        return res.status(200).json({ post });
    },
];

// ADMIN only
export const deletePostDelete = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    async (req: Request<PostParams, {}, {}, {}>, res: Response) => {
        const postId = parseInt(req.params.postId);
        const post = await query.deletePost(postId);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        return res.status(204).send();
    },
];
