import passport from "../config/passport.config.js";
import * as query from "../db/userQueries.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { roleCheck } from "../middlewares/roleCheck.js";
import { validationResult } from "express-validator";
import { validateUser } from "../validation/user-validation.js";
import { Request, Response, NextFunction } from "express";
import { UserParams, UserDTO } from "../@types/user.js";

// ADMIN only
export const allUsersGet = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    async (req: Request<{}, {}, {}, {}>, res: Response) => {
        const users = await query.getAllUsers();
        return res.status(200).json({ users });
    },
];

export const userGet = async (req: Request<UserParams, {}, {}, {}>, res: Response) => {
    const userId = parseInt(req.params.userId);
    const user = await query.getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "Error: User not found" });
    }
    return res.status(200).json({
        username: user.username,
        posts: user.posts,
        comments: user.comments,
    });
};

export const createUserPost = [
    validateUser,
    async (req: Request<{}, {}, UserDTO, {}>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await query.registerUser(req.body.username, hashedPassword);
        if (newUser === "Username is taken") {
            return res.status(400).json({ message: "Username is taken" });
        }

        // Generate JWT if user registers
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET_KEY || "jwt_secret",
            {
                expiresIn: "2h",
            }
        );
        return res.status(201).json({ userId: newUser.id, username: newUser.username, token });
    },
];

export const updateUserPut = [
    passport.authenticate("jwt", { session: false }),
    validateUser,
    async (req: Request<UserParams, {}, UserDTO, {}>, res: Response) => {
        if (!req.user) return;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const targetUserId = parseInt(req.params.userId);
        const currentUserId = req.user.id;
        if (targetUserId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Can't edit other users" });
        }
        const newUsername = req.body.username;
        const newPassword = req.body.password;
        const user = await query.updateUser(targetUserId, newUsername, newPassword);
        if (!user) {
            return res.status(400).json({
                message: "Error: User not found or username is already taken",
            });
        }
        return res.status(200).json({ message: `Updated user ${user.username}` });
    },
];

export const deleteUserDelete = [
    passport.authenticate("jwt", { session: false }),
    async (req: Request<UserParams, {}, {}, {}>, res: Response) => {
        if (!req.user) return;

        const targetUserId = parseInt(req.params.userId);
        const currentUserId = req.user.id;
        if (targetUserId !== currentUserId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Can't delete other users" });
        }
        const user = await query.deleteUser(targetUserId);
        if (!user) {
            return res.status(404).json({ message: "Error: User not found" });
            
        }
        return res.status(204).send();
    },
];
