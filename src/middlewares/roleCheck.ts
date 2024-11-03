import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const roleCheck = (requiredRole: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === requiredRole) {
            return next();
        }
        return res
            .status(403)
            .json({ message: "Forbidden: You do not have access to this resource" });
    };
};
