export const roleCheck = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            return next();
        }
        return res
            .status(403)
            .json({ message: "Forbidden: You do not have access to this resource" });
    };
};
//# sourceMappingURL=roleCheck.js.map