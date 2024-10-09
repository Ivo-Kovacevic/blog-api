import asyncHandler from "express-async-handler";
import passport from "../config/passport.config.js";
import query from "../db/commentQueries.js";
import { roleCheck } from "../middlewares/roleCheck.js";
import { Request, Response, NextFunction } from "express";

// ADMIN only
export const allCommentsGet = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req: Request, res: Response) => {
        const comments = await query.getAllComments();
        if (!comments || comments.length === 0) {
            res.status(204).json({ message: "No post was found" });
            return;
        }
        res.status(200).json({ comments });
    }),
];

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
        const comment = await query.deleteComment(commentId);
        res.status(204).send();
    }),
];

const controller = {
    allCommentsGet,
    commentGet,
    createCommentPost,
    updateCommentPut,
    deleteCommentDelete,
};

export default controller;
