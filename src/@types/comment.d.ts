import { ParsedQs } from "qs";

export interface CommentParams {
    postId?: string;
    userId?: string;
    commentId?: string;
}

export interface CommentQuery extends ParsedQs {
    page?: string;
    limit?: string;
}

export interface CommentDTO {
    text: string;
}