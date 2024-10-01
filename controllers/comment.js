const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/commentQueries");
const { roleCheck } = require("../middlewares/roleCheck");
const { validationResult } = require("express-validator");
const { validateUser } = require("../validation/user-validation");

// ADMIN only
exports.allCommentsGet = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req, res) => {
        comments = await query.getAllComments();
        if (!comments || comments.length === 0) {
            return res.status(204).json({ message: "No post was found" });
        }
        return res.status(200).json({ comments });
    }),
];

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
        const postId = parseInt(req.body.postId);
        const text = req.body.text;
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
