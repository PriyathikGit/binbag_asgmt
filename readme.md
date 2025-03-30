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

- `POST http://localhost:5000/api/user/register` - Register a new user
- `POST http://localhost:5000/api/user/login` - Login and receive a JWT token

### User Profile

- `GET http://localhost:5000/api/user/:id` - Retrieve a user's profile (protected)
- `GET http://localhost:5000/api/user/me` - Retrieve my details (protected)
- `PATCH http://localhost:5000/api/user/:id` - Update a user's profile (protected)


