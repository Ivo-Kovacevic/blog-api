import { Status } from "@prisma/client";

export interface PostParams {
    postId: string;
}

export interface PostDTO {
    title: string;
    text: string;
    status: Status;
}