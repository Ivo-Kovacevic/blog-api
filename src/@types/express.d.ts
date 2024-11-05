import { User } from "@prisma/client";
import { Request } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}

export interface RequestWithUser<Params = {}, ResBody = any, ReqBody = any, Query = {}>
    extends Request<Params, ResBody, ReqBody, Query> {
    user: User;
}
