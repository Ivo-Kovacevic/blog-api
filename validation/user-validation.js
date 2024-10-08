const { check, body } = require("express-validator");

const validateUser = [
    check("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage(`Username must not be empty`)
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage(`Username must only contain letters and numbers.`)
        .isLength({ min: 4, max: 20 })
        .withMessage(`Username must be between 4 and 20 characters.`),

    check("password")
        .trim()
        .isLength({ min: 4 })
        .withMessage(`Password must be at least 4 characters long.`),
];

module.exports = { validateUser };
