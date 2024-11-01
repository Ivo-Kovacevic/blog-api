import passport from "passport";

export const attachUserMiddleware = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return next();
        }
        req.user = user;
        next();
    })(req, res, next);
};
