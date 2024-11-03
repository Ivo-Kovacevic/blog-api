var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import passport from "../config/passport.config.js";
import * as query from "../db/commentQueries.js";
export const allCommentsGet = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.page || !req.query.limit) {
        return;
    }
    let postId;
    let userId;
    if (req.params.postId) {
        postId = parseInt(req.params.postId);
    }
    if (req.params.userId) {
        userId = parseInt(req.params.userId);
    }
    const page = parseInt(req.query.page) || 1; // 1, 2
    const limit = parseInt(req.query.limit) || 5; // 5
    const skip = (page - 1) * limit; // 0, 5
    const { comments, totalCount } = yield query.getAllComments({ postId, userId }, limit, skip);
    if (!comments || comments.length === 0) {
        res.status(204).json({ message: "No post was found" });
        return;
    }
    const hasMore = skip + comments.length < totalCount;
    res.status(200).json({ comments, hasMore });
}));
export const commentGet = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = parseInt(req.params.commentId);
    const comment = yield query.getCommentById(commentId);
    if (!comment) {
        res.status(404).json({ message: "Error: Comment not found" });
        return;
    }
    res.status(200).json({ comment });
}));
export const createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const authorId = req.user.id;
        const postId = parseInt(req.params.postId);
        const text = req.body.text;
        const newComment = yield query.newComment(authorId, postId, text);
        if (!newComment) {
            res.status(404).json({ message: "Error: Couldn't create message" });
            return;
        }
        res.status(201).json({ comment: newComment });
    })),
];
export const updateCommentPut = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = yield query.getCommentById(commentId);
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
        const comment = yield query.updateComment(commentId, text);
        res.status(200).json({ comment });
    })),
];
export const deleteCommentDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = yield query.getCommentById(commentId);
        if (!commentCheck) {
            res.status(404).json({ message: "Error: Comment not found" });
            return;
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            res.status(403).json({ message: "Forbidden: Can't delete others comments" });
            return;
        }
        yield query.deleteComment(commentId);
        res.status(204).send();
    })),
];
//# sourceMappingURL=comment.js.map