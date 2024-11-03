import asyncHandler from "express-async-handler";
import passport from "../config/passport.config.js";
import * as query from "../db/commentQueries.js";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface CommentRequestParams {
    postId?: string;
    userId?: string;
    commentId?: string;
}

interface CommentRequestQuery extends ParsedQs {
    page?: string;
    limit?: string;
}

export const allCommentsGet = asyncHandler(
    async (
        req: Request<CommentRequestParams, any, any, CommentRequestQuery>,
        res: Response
    ) => {
        if (!req.query.page || !req.query.limit) {
            return;
        }
        let postId: number | undefined;
        let userId: number | undefined;

        if (req.params.postId) {
            postId = parseInt(req.params.postId);
        }
        if (req.params.userId) {
            userId = parseInt(req.params.userId);
        }

        const page = parseInt(req.query.page) || 1; // 1, 2
        const limit = parseInt(req.query.limit) || 5; // 5
        const skip = (page - 1) * limit; // 0, 5

        const { comments, totalCount } = await query.getAllComments(
            { postId, userId },
            limit,
            skip
        );

        if (!comments || comments.length === 0) {
            res.status(204).json({ message: "No post was found" });
            return;
        }
        const hasMore = skip + comments.length < totalCount;

        res.status(200).json({ comments, hasMore });
    }
);

export const commentGet = asyncHandler(async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await query.getCommentById(commentId);
    if (!comment) {
        res.status(404).json({ message: "Error: Comment not found" });
        return;
    }
    res.status(200).json({ comment });
});

export const createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
        const authorId = req.user.id;
        const postId = parseInt(req.params.postId);
        const text = req.body.text;

        const newComment = await query.newComment(authorId, postId, text);
        if (!newComment) {
            res.status(404).json({ message: "Error: Couldn't create message" });
            return;
        }
        res.status(201).json({ comment: newComment });
    }),
];

export const updateCommentPut = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = await query.getCommentById(commentId);
        if (!commentCheck) {
            res.status(404).json({ message: "Error: Comment not found" });
            return;
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            res.status(403).json({ message: "Forbidden: Can't edit others comments" });
            return;
        }
        const text = req.body.text;
        const comment = await query.updateComment(commentId, text);
        res.status(200).json({ comment });
    }),
];

export const deleteCommentDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = await query.getCommentById(commentId);
        if (!commentCheck) {
            res.status(404).json({ message: "Error: Comment not found" });
            return;
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            res.status(403).json({ message: "Forbidden: Can't delete others comments" });
            return;
        }
        await query.deleteComment(commentId);
        res.status(204).send();
    }),
];
