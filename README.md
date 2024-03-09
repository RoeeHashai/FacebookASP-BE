
# FacebookASP-BE

Welcome to the Backend of the FacebookASP!

This section of our application powers the core functionalities of a Facebook-like platform, leveraging Express and MongoDB to handle operations and data management tasks. Designed to support real-time interactions, our backend ensures a seamless experience for web and andriod users. The backend uses a RESTful API, ensuring a wide range of accessibility and functionality.

Utilizing MongoDB hosted in the cloud, our database is accessible from anywhere, providing a flexible and scalable solution for social networking needs. Whether you're posting updates, commenting on friends' posts, or managing user accounts, our backend handles it all with precision and reliability.

## API Routes and Descriptions

### Users
- **`POST /users`**: Register a new user.
- **`GET /users/:id`**: Retrieve a specific user's details.
- **`PUT /users/:id`**: Update a user's details.
- **`PATCH /users/:id`**: Partially update a user's details.
- **`DELETE /users/:id`**: Delete a user.

### Posts
- **`GET /posts`**: Get posts accessible by the user, respecting friend connections.
- **`POST /posts`**: Create a new post.
- **`PATCH /posts/:pid`**: Update a specific post.
- **`DELETE /posts/:pid`**: Delete a specific post.
- **`POST /posts/:pid/likes`**: Like a post.
- **`DELETE /posts/:pid/likes`**: Unlike a post.

### Comments
- **`GET /posts/:pid/comments`**: Get comments for a post.
- **`POST /posts/:pid/comments`**: Comment on a post.
- **`PATCH /posts/:pid/comments/:cid`**: Update a specific comment.
- **`DELETE /posts/:pid/comments/:cid`**: Delete a specific comment.

### Friends
- **`GET /users/:id/friends`**: Get a user's friends.
- **`POST /users/:id/friends`**: Add a friend.
- **`PATCH /users/:id/friends/:fid`**: Accept a friend request.
- **`DELETE /users/:id/friends/:fid`**: Remove a friend.

### Tokens
- **`POST /tokens`**: Generate a new authentication token for a user.

## Installation and Running the App

Before diving in, ensure Node.js, npm, and MongoDB are set up on your machine. Our MongoDB database runs in the cloud, making it accessible from any computer with internet access.

### Installation
1. Clone this repository:
```sh
git clone https://github.com/RoeeHashai/FacebookASP-BE.git
cd FacebookASP-BE
```

2. Install dependencies:
```sh
npm install
```

### Running the Application
- **Web Application**: To connect to the server for web access, run:
```sh
npm start
```
Navigate to `localhost:8080` in your web browser to access the backend services.

- **Android App**: Users looking to access the platform via the Android app will need to download the app. The backend will integrate with the app, offering the same range of services as the web version.

The MongoDB database is hosted in the cloud, ensuring that your social media platform is scalable and accessible from anywhere.

For more information about the frontend functionalities and how they integrate with this backend, please visit the [Frontend Web App GitHub Repository](https://github.com/RoeeHashai/FacebookASP-WebApp-FE) and [Frontend Andriod App GitHub Repository](https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE).

Enjoy!
