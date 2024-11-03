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
import * as query from "../db/postQueries.js";
import { roleCheck } from "../middlewares/roleCheck.js";
export const allPostsGet = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let onlyPublished = true;
    // Get all posts if user is ADMIN
    if (req.user && req.user.role === "ADMIN") {
        onlyPublished = false;
    }
    const posts = yield query.getAllPosts(onlyPublished);
    if (!posts || posts.length === 0) {
        res.status(204).json({ message: "No post was found" });
        return;
    }
    res.status(200).json({ posts });
}));
export const postGet = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.postId);
    const post = yield query.getPostById(postId);
    if (!post) {
        res.status(404).json({ message: "Error: Post not found" });
        return;
    }
    res.status(200).json({ post });
}));
// ADMIN only
export const createPostPost = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const authorId = req.user.id;
        const title = req.body.title;
        const content = req.body.content;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const newPost = yield query.newPost(authorId, title, content, status);
        if (!newPost) {
            res.status(404).json({ message: "Error: Couldn't create post" });
            return;
        }
        res.status(201).json({ post: newPost });
    })),
];
// ADMIN only
export const updatePostPut = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = parseInt(req.params.postId);
        const title = req.body.title;
        const content = req.body.content;
        const validStatuses = ["PUBLISHED", "UNPUBLISHED"];
        const status = validStatuses.includes(req.body.status) ? req.body.status : "UNPUBLISHED";
        const post = yield query.updatePost(postId, title, content, status);
        if (!post) {
            res.status(404).json({ message: "Error: Post not found" });
            return;
        }
        res.status(200).json({ post });
    })),
];
// ADMIN only
export const deletePostDelete = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = parseInt(req.params.postId);
        const post = yield query.deletePost(postId);
        if (!post) {
            res.status(404).json({ message: "Error: Post not found" });
            return;
        }
        res.status(204).send();
    })),
];
//# sourceMappingURL=post.js.map