import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const attachUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: Error | null, user: User | false) => {
        if (err || !user) {
            return next();
        }
        req.user = user;
        next();
    })(req, res, next);
};
