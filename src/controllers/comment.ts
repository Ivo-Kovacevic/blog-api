import passport from "../config/passport.config.js";
import * as query from "../db/commentQueries.js";
import { Request, Response, NextFunction } from "express";
import { CommentDTO, CommentParams, CommentQuery } from "../@types/comment.js";

export const allCommentsGet = async (
    req: Request<CommentParams, {}, {}, CommentQuery>,
    res: Response
) => {
    let postId: number | undefined;
    let userId: number | undefined;
    if (req.params.postId) {
        postId = parseInt(req.params.postId);
    }
    if (req.params.userId) {
        userId = parseInt(req.params.userId);
    }

    let page: number;
    let limit: number;
    if (!req.query.page || !req.query.limit) {
        // Get all comments if page and limit are not provided
        page = 1;
        limit = -1;
    } else {
        page = parseInt(req.query.page);
        limit = parseInt(req.query.limit);
    }
    const skip = (page - 1) * limit;

    const { comments, totalCount } = await query.getAllComments({ postId, userId }, limit, skip);

    if (!comments || comments.length === 0) {
        return res.status(204).json({ message: "No post was found" });
    }
    const hasMore = skip + comments.length < totalCount;

    return res.status(200).json({ comments, hasMore });
};

export const commentGet = async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await query.getCommentById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Error: Comment not found" });
    }
    return res.status(200).json({ comment });
};

export const createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    async (req: Request<any, any, CommentDTO, any>, res: Response) => {
        if (!req.user) return;

        const authorId = req.user.id;
        const postId = parseInt(req.params.postId);
        const text = req.body.text;

        const newComment = await query.newComment(authorId, postId, text);
        if (!newComment) {
            return res.status(404).json({ message: "Error: Couldn't create message" });
        }
        return res.status(201).json({ comment: newComment });
    },
];

export const updateCommentPut = [
    passport.authenticate("jwt", { session: false }),
    async (req: Request<any, any, CommentDTO, any>, res: Response) => {
        if (!req.user) return;

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
    async (req: Request, res: Response) => {
        if (!req.user) return;

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
