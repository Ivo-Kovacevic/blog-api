const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/userQueries");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { roleCheck } = require("../middlewares/roleCheck");
const { validationResult } = require("express-validator");
const { validateUser } = require("../validation/user-validation");

// ADMIN only
exports.allUsersGet = [
    passport.authenticate("jwt", { session: false }),
    roleCheck("ADMIN"),
    asyncHandler(async (req, res) => {
        const users = await query.getAllUsers();
        return res.status(200).json({ users });
    }),
];

exports.userGet = asyncHandler(async (req, res) => {
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
});

exports.createUserPost = [
    validateUser,
    asyncHandler(async (req, res) => {
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
        return res.status(201).json({ token });
    }),
];

exports.updateUserPut = [
    passport.authenticate("jwt", { session: false }),
    validateUser,
    asyncHandler(async (req, res) => {
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
    }),
];

exports.deleteUserDelete = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
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
    }),
];
