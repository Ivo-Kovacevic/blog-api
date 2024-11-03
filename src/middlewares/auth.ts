import { User } from "@prisma/client";
import passport from "../config/passport.config.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res, next) => {
    passport.authenticate(
        "local",
        { session: false },
        (err: Error | null, user: User | false, info: { message?: string } | undefined) => {
            if (err || !user) {
                return res.status(400).json({
                    message: info?.message || "Login failed", // More descriptive error message if available
                    user: req.body,
                });
            }
            // Generate JWT if user is authenticated
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET_KEY || "jwt_secret",
                { expiresIn: "2h" }
            );
            return res.status(200).json({ userId: user.id, username: user.username, token });
        }
    )(req, res, next);
});
