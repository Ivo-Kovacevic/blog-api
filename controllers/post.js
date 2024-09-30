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

exports.createPostPost = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req, res) => {
        const authorId = req.user.id;
        const title = req.body.title;
        const content = req.body.content;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const newPost = await query.newPost(authorId, title, content, status);
        if (!newPost) {
            return res.status(404).json({ message: "Error: Couldn't create post" });
        }
        return res.status(201).json({ post: newPost });
    }),
];

exports.updatePostPut = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req, res) => {
        const postId = parseInt(req.params.postId);
        const title = req.body.title;
        const content = req.body.content;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const post = await query.updatePost(postId, title, content, status);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        return res.status(200).json({ post });
    }),
];

exports.deletePostDelete = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req, res) => {
        const postId = parseInt(req.params.postId);
        const post = await query.deletePost(postId);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        return res.status(204).send();
    }),
];
