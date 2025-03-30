# User Profile Management API

A RESTful API for managing user profiles with JWT authentication.

## Features

- User registration and login
- JWT authentication
- Protected routes (users can only access their own profiles)
- Profile retrieval and updates
- MongoDB database
- Error handling

## Installation

1. Clone the repository:
   ```bash
   git clone = https://github.com/PriyathikGit/binbag_asgmt.git
   open the folder with vscode
   ```

## Routes

### Authentication

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login and receive a JWT token

### User Profile

- `GET /api/user/:id` - Retrieve a user's profile (protected)
- `GET /api/user/me` - Retrieve my details (protected)
- `PATCH /api/user/:id` - Update a user's profile (protected)


