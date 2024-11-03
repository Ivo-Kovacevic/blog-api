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
import * as query from "../db/userQueries.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { roleCheck } from "../middlewares/roleCheck.js";
import { validationResult } from "express-validator";
import { validateUser } from "../validation/user-validation.js";
// ADMIN only
export const allUsersGet = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield query.getAllUsers();
        res.status(200).json({ users });
    })),
];
export const userGet = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const user = yield query.getUserById(userId);
    if (!user) {
        res.status(404).json({ message: "Error: User not found" });
        return;
    }
    res.status(200).json({
        username: user.username,
        posts: user.posts,
        comments: user.comments,
    });
}));
export const createUserPost = [
    validateUser,
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const hashedPassword = yield bcrypt.hash(req.body.password, 10);
        const newUser = yield query.registerUser(req.body.username, hashedPassword);
        if (newUser === "Username is taken") {
            res.status(400).json({ message: "Username is taken" });
            return;
        }
        // Generate JWT if user registers
        const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET_KEY || "jwt_secret", {
            expiresIn: "2h",
        });
        res.status(201).json({ userId: newUser.id, username: newUser.username, token });
    })),
];
export const updateUserPut = [
    passport.authenticate("jwt", { session: false }),
    validateUser,
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const targetUserId = parseInt(req.params.userId);
        const currentUserId = req.user.id;
        if (targetUserId !== currentUserId) {
            res.status(403).json({ message: "Forbidden: Can't edit other users" });
            return;
        }
        const newUsername = req.body.username;
        const newPassword = req.body.password;
        const user = yield query.updateUser(targetUserId, newUsername, newPassword);
        if (!user) {
            res.status(400).json({
                message: "Error: User not found or username is already taken",
            });
            return;
        }
        res.status(200).json({ message: `Updated user ${user.username}` });
    })),
];
export const deleteUserDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const targetUserId = parseInt(req.params.userId);
        const currentUserId = req.user.id;
        if (targetUserId !== currentUserId && req.user.role !== "ADMIN") {
            res.status(403).json({ message: "Forbidden: Can't delete other users" });
            return;
        }
        const user = yield query.deleteUser(targetUserId);
        if (!user) {
            res.status(404).json({ message: "Error: User not found" });
            return;
        }
        res.status(204).send();
    })),
];
//# sourceMappingURL=user.js.map