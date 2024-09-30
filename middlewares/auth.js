const passport = require("../config/passport.config");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");
const query = require("../db/userQueries");

exports.register = [
    validateNewUser,
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

exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? "Incorrect username or password" : "Login failed",
                user: req.body,
            });
        }
        // Generate JWT if user is authenticated
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET_KEY || "jwt_secret",
            {
                expiresIn: "2h",
            }
        );
        return res.status(200).json({ token });
    })(req, res, next);
});
