const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/commentQueries");
const { roleCheck } = require("../middlewares/roleCheck");

exports.createCommentPost = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
        const authorId = req.user.id;
        const postId = req.body.id;
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
        const text = req.body.text;
        const comment = await query.updateComment(commentId, text);
        if (!comment) {
            return res.status(404).json({ message: "Error: Comment not found" });
        }
        return res.status(200).json({ comment });
    }),
];

exports.deleteCommentDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
        const commentId = parseInt(req.params.commentId);
        const comment = await query.deleteComment(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Error: Comment not found" });
        }
        return res.status(204).send();
    }),
];
