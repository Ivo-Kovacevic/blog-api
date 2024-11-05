import { ParsedQs } from "qs";

export interface ResourceParams {
    postId?: string;
    userId?: string;
}

export interface CommentParams {
    postId: string;
    commentId: string;
}

export interface CommentQuery extends ParsedQs {
    page?: string;
    limit?: string;
}

export interface CommentDTO {
    text: string;
}