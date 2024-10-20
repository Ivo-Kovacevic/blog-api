const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/commentQueries");
const { roleCheck } = require("../middlewares/roleCheck");
const { validationResult } = require("express-validator");
const { validateUser } = require("../validation/user-validation");

// ADMIN only
exports.allCommentsGet = asyncHandler(async (req, res) => {
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

    const { comments, totalCount } = await query.getAllComments({postId, userId}, limit, skip);
    
    if (!comments || comments.length === 0) {
        return res.status(204).json({ message: "No post was found" });
    }
    const hasMore = (skip + comments.length) < totalCount;

    return res.status(200).json({ comments, hasMore });
});

exports.commentGet = asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await query.getCommentById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Error: Comment not found" });
    }
    return res.status(200).json({ comment });
});

exports.createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
        const authorId = req.user.id;
        const postId = parseInt(req.params.postId);
        const text = req.body.text;
        console.log(req.params);

        const newComment = await query.newComment(authorId, postId, text);
        if (!newComment) {
            return res.status(404).json({ message: "Error: Couldn't create message" });
        }
        return res.status(201).json({ comment: newComment });
    }),
];

exports.updateCommentPut = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
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
    }),
];

exports.deleteCommentDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
        const commentId = parseInt(req.params.commentId);
        const commentCheck = await query.getCommentById(commentId);
        if (!commentCheck) {
            return res.status(404).json({ message: "Error: Comment not found" });
        }
        const currentUserId = req.user.id;
        if (commentCheck.authorId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Can't delete others comments" });
        }
        const comment = await query.deleteComment(commentId);
        return res.status(204).send();
    }),
];
