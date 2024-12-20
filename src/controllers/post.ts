import passport from "../config/passport.config.js";
import * as query from "../db/postQueries.js";
import { roleCheck } from "../middlewares/roleCheck.js";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Params, Body } from "../@types/post.js";
import { Query, RequestWithUser } from "../@types/express.js";

export const allPostsGet: RequestHandler<{}, {}, {}, Query> = async (req, res) => {
    let onlyPublished = true;

    // Get all posts if user is ADMIN
    if (req.user && req.user.role === "ADMIN") onlyPublished = false;

    const page = req.query.page ? parseInt(req.query.page) : 1; // Set page to 1 if not provided
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined; // Set limit to undefined if not provided to get all posts
    const skip = limit ? (page - 1) * limit : 0; // Set skip to 0 if not provided

    const { posts, totalCount } = await query.getAllPosts(onlyPublished, limit, skip);
    if (!posts || posts.length === 0) {
        res.status(204).json({ message: "No post was found" });
        return;
    }
    const hasMore = skip + posts.length < totalCount;

    res.status(200).json({ posts, hasMore });
};

export const postGet: RequestHandler<Params, {}, {}, {}> = async (req, res) => {
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
    async (req: RequestWithUser<{}, {}, Body, {}>, res: Response) => {
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
    async (req: Request<Params, {}, Body, {}>, res: Response) => {
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
    async (req: Request<Params, {}, {}, {}>, res: Response) => {
        const postId = parseInt(req.params.postId);
        const post = await query.deletePost(postId);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        return res.status(204).send();
    },
];
