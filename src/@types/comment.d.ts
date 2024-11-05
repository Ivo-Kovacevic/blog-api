export interface ResourceParams {
    postId?: string;
    userId?: string;
}

export interface Params {
    postId: string;
    commentId: string;
}

export interface Query {
    page?: string;
    limit?: string;
}

export interface Body {
    text: string;
}
