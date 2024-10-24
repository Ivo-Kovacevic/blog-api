# API Endpoints

This API provides endpoints for managing users, posts, and comments. Below are the available endpoints and their descriptions.

## Authentication

| Method | Endpoint | Description                             |
| ------ | -------- | --------------------------------------- |
| POST   | /login   | Authenticate a user and receive a token |

## Users

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | /users         | Retrieve all users       |
| GET    | /users/:userId | Retrieve a specific user |
| POST   | /users         | Create a new user        |
| PUT    | /users/:userId | Update a specific user   |
| DELETE | /users/:userId | Delete a specific user   |

## Posts

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | /posts         | Retrieve all posts       |
| GET    | /posts/:postId | Retrieve a specific post |
| POST   | /posts         | Create a new post        |
| PUT    | /posts/:postId | Update a specific post   |
| DELETE | /posts/:postId | Delete a specific post   |

## Comments

### Post Comments

| Method | Endpoint                           | Description                               |
| ------ | ---------------------------------- | ----------------------------------------- |
| GET    | /posts/:postId/comments            | Retrieve all comments for a specific post |
| GET    | /posts/:postId/comments/:commentId | Retrieve a specific comment for a post    |
| POST   | /posts/:postId/comments            | Create a new comment for a specific post  |
| PUT    | /posts/:postId/comments/:commentId | Update a specific comment for a post      |
| DELETE | /posts/:postId/comments/:commentId | Delete a specific comment for a post      |

### User Comments

| Method | Endpoint                           | Description                              |
| ------ | ---------------------------------- | ---------------------------------------- |
| GET    | /users/:userId/comments            | Retrieve all comments by a specific user |
| GET    | /users/:userId/comments/:commentId | Retrieve a specific comment by a user    |
| POST   | /users/:userId/comments            | Create a new comment for a specific user |
| PUT    | /users/:userId/comments/:commentId | Update a specific comment by a user      |
| DELETE | /users/:userId/comments/:commentId | Delete a specific comment by a user      |

## Error Handling

| Method | Endpoint | Description                            |
| ------ | -------- | -------------------------------------- |
| ALL    | \*       | Returns a 404 error for invalid routes |

Note: All POST, PUT and DELETE methods require authentication. Make sure to include the authentication token in the request headers.
