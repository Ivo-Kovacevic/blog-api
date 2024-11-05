import { Status } from "@prisma/client";

export interface Params {
    postId: string;
}

export interface Body {
    title: string;
    text: string;
    status: Status;
}
