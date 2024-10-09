import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

export const attachUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: Error | null, user: User | false) => {
        if (err || !user) {
            return next();
        }
        req.user = user;
        next();
    })(req, res, next);
};
