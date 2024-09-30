const asyncHandler = require("express-async-handler");
const passport = require("../config/passport.config");
const query = require("../db/userQueries");
const { roleCheck } = require("../middlewares/roleCheck");

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
        user: user.username,
        posts: user.posts,
        comments: user.comments,
    });
});

exports.updateUserPut = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res) => {
        const targetUserId = parseInt(req.params.userId);
        const currentUserId = req.user.id;
        if (targetUserId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Can't edit other users" });
        }
        const newUsername = req.body.username;
        const user = await query.updateUser(targetUserId, newUsername);
        if (!user) {
            return res.status(404).json({
                message: "Error: User not found or username is already taken",
            });
        }
        return res.status(200).json({ message: `Updated user ${user.name}` });
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
