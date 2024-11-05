import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../@types/express.js";

export const roleCheck = (requiredRole: Role) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (req.user.role === requiredRole) {
            return next();
        }
        res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
    };
};
