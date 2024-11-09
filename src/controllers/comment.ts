import passport from "../config/passport.config.js";
import * as query from "../db/commentQueries.js";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Body, Params, ResourceParams } from "../@types/comment.js";
import { Query, RequestWithUser } from "../@types/express.js";

export const allCommentsGet: RequestHandler<ResourceParams, {}, {}, Query> = async (req, res) => {
    let postId: number | undefined;
    let userId: number | undefined;
    // Get postId if accessing comments over post or userId if accessing over user
    // example: get all comments for specific post ".../posts/3/comments"
    if (req.params.postId) postId = parseInt(req.params.postId);

    // example: get all comments for specific user ".../users/3/comments"
    if (req.params.userId) userId = parseInt(req.params.userId);

    const page = req.query.page ? parseInt(req.query.page) : 1; // Set page to 1 if not provided
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined; // Set limit to undefined if not provided to get all posts
    const skip = limit ? (page - 1) * limit : 0; // Set skip to 0 if not provided

    const { comments, totalCount } = await query.getAllComments({ postId, userId }, limit, skip);

    if (!comments || comments.length === 0) {
        res.status(204).json({ message: "No post was found" });
        return;
    }
    const hasMore = skip + comments.length < totalCount;

    res.status(200).json({ comments, hasMore });
};

export const commentGet: RequestHandler<Params, {}, {}, {}> = async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await query.getCommentById(commentId);
    if (!comment) {
        res.status(404).json({ message: "Error: Comment not found" });
        return;
    }
    res.status(200).json({ comment });
};

export const createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    async (req: RequestWithUser<Params, {}, Body, {}>, res: Response) => {
        const authorId = req.user.id;
        const postId = parseInt(req.params.postId);
        const text = req.body.text;

        const comment = await query.newComment(authorId, postId, text);
        if (!comment) {
            return res.status(404).json({ message: "Error: Could not create comment" });
        }
        return res.status(201).json({ comment });
    },
];

export const updateCommentPut = [
    passport.authenticate("jwt", { session: false }),
    async (req: RequestWithUser<Params, {}, Body, {}>, res: Response) => {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = await query.getCommentById(commentId);
        if (!commentCheck) {
            return res.status(404).json({ message: "Error: Comment not found" });
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Can't edit others comments" });
        }
        const text = req.body.text;
        const comment = await query.updateComment(commentId, text);
        return res.status(200).json({ comment });
    },
];

export const deleteCommentDelete = [
    passport.authenticate("jwt", { session: false }),
    async (req: RequestWithUser<Params, {}, {}, {}>, res: Response) => {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = await query.getCommentById(commentId);
        if (!commentCheck) {
            return res.status(404).json({ message: "Error: Comment not found" });
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Can't delete others comments" });
        }
        await query.deleteComment(commentId);
        return res.status(204).send();
    },
];
