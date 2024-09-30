const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/postQueries");
const { roleCheck } = require("../middlewares/roleCheck");

exports.allPostsGet = asyncHandler(async (req, res) => {
    let onlyPublished = true;

    // Get all posts if user is ADMIN
    if (req.user && req.user.role === "ADMIN") {
        onlyPublished = false;
    }
    posts = await query.getAllPosts(onlyPublished);
    if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "Error: No post was found" });
    }
    return res.status(200).json({ posts });
});

exports.postGet = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = await query.getPostById(postId);
    if (!post) {
        return res.status(404).json({ message: "Error: Post not found" });
    }
    return res.status(200).json({ post });
});

exports.postPost = asyncHandler(async (req, res) => {});
exports.postPut = asyncHandler(async (req, res) => {});
exports.postDelete = asyncHandler(async (req, res) => {});
