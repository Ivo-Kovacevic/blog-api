import { Status } from "@prisma/client";

export interface UserParams {
    userId: string;
}

export interface UserDTO {
    username: string;
    password: string;
}
