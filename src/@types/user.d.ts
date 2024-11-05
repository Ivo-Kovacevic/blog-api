import { Status } from "@prisma/client";
import { ParamsDictionary } from 'express-serve-static-core';

export interface UserParams extends ParamsDictionary {
    userId: string;
}

export interface UserDTO {
    username: string;
    password: string;
}
