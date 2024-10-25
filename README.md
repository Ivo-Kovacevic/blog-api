# API Endpoints

This API provides endpoints for managing users, posts, and comments. Below are the available endpoints, their descriptions, and what they expect.

## Authentication

| Method | Endpoint | Description | Expected Input |
|--------|----------|-------------|----------------|
| POST   | /login   | Authenticate a user and receive a token | `username`, `password` in request body |

## Users

| Method | Endpoint      | Description                | Expected Input | Authentication |
|--------|---------------|----------------------------|----------------|----------------|
| GET    | /users        | Retrieve all users         | None | Admin only |
| GET    | /users/:userId| Retrieve a specific user   | `userId` in URL | None |
| POST   | /users        | Create a new user          | `username`, `password` in request body | None |
| PUT    | /users/:userId| Update a specific user     | `userId` in URL, `username`, `password` in request body | User authentication |
| DELETE | /users/:userId| Delete a specific user     | `userId` in URL | User authentication or Admin |

## Posts

| Method | Endpoint      | Description                | Expected Input | Authentication |
|--------|---------------|----------------------------|----------------|----------------|
| GET    | /posts        | Retrieve all posts         | None | None (Admin sees all, others see published) |
| GET    | /posts/:postId| Retrieve a specific post   | `postId` in URL | None |
| POST   | /posts        | Create a new post          | `title`, `content`, `status` in request body | Admin only |
| PUT    | /posts/:postId| Update a specific post     | `postId` in URL, `title`, `content`, `status` in request body | Admin only |
| DELETE | /posts/:postId| Delete a specific post     | `postId` in URL | Admin only |

## Comments

### Post Comments

| Method | Endpoint                           | Description                                  | Expected Input | Authentication |
|--------|-----------------------------------|----------------------------------------------|----------------|----------------|
| GET    | /posts/:postId/comments           | Retrieve all comments for a specific post    | `postId` in URL, optional `page` and `limit` query params | None |
| GET    | /posts/:postId/comments/:commentId| Retrieve a specific comment for a post       | `postId` and `commentId` in URL | None |
| POST   | /posts/:postId/comments           | Create a new comment for a specific post     | `postId` in URL, `text` in request body | User authentication |
| PUT    | /posts/:postId/comments/:commentId| Update a specific comment for a post         | `postId` and `commentId` in URL, `text` in request body | User authentication (own comments only) |
| DELETE | /posts/:postId/comments/:commentId| Delete a specific comment for a post         | `postId` and `commentId` in URL | User authentication (own comments only) |

### User Comments

| Method | Endpoint                           | Description                                  | Expected Input | Authentication |
|--------|-----------------------------------|----------------------------------------------|----------------|----------------|
| GET    | /users/:userId/comments           | Retrieve all comments by a specific user     | `userId` in URL, optional `page` and `limit` query params | None |
| GET    | /users/:userId/comments/:commentId| Retrieve a specific comment by a user        | `userId` and `commentId` in URL | None |
| POST   | /users/:userId/comments           | Create a new comment for a specific user     | `userId` in URL, `text` in request body | User authentication |
| PUT    | /users/:userId/comments/:commentId| Update a specific comment by a user          | `userId` and `commentId` in URL, `text` in request body | User authentication (own comments only) |
| DELETE | /users/:userId/comments/:commentId| Delete a specific comment by a user          | `userId` and `commentId` in URL | User authentication (own comments only) |

## Error Handling

| Method | Endpoint | Description                           |
|--------|----------|---------------------------------------|
| ALL    | *        | Returns a 404 error for invalid routes |

Note: 
- All POST, PUT and DELETE methods require authentication. 
- Admin-only routes require the user to have an "ADMIN" role.
- For authenticated routes, include the JWT token in the Authorization header as "Bearer <token>".
- The `status` field for posts can be either "PUBLISHED" or "UNPUBLISHED".
