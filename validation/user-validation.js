const { check, body } = require("express-validator");

const alphaErr = "must only contain letters and numbers.";
const usernameLengthErr = "must be between 4 and 20 characters.";
const passwordLengthErr = "must be at least 4 characters long.";
const passwordMatchErr = "Passwords do not match";

const validateNewUser = [
    check("username")
        .trim()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage(`Username ${alphaErr}`)
        .isLength({ min: 4, max: 20 })
        .withMessage(`Username ${usernameLengthErr}`),

    check("password")
        .trim()
        .isLength({ min: 4 })
        .withMessage(`Password ${passwordLengthErr}`)
];

module.exports = { validateNewUser };
