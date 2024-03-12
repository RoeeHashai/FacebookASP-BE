
# FacebookASP-BE

Welcome to the Backend of the FacebookASP!

This section of our application powers the core functionalities of a Facebook-like platform, leveraging Express and MongoDB to handle operations and data management tasks. Designed to support real-time interactions, our backend ensures a seamless experience for web and andriod users. The backend uses a RESTful API, ensuring a wide range of accessibility and functionality.

Utilizing MongoDB, our database provides a flexible and scalable solution for social networking needs. Whether you're posting updates, commenting on friends' posts, or managing user accounts, our backend handles it all with precision and reliability.

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

Before diving in, ensure Node.js, npm, and MongoDB are set up on your machine.

### Installation
1. **Clone this repository:**
    ```sh
    git clone https://github.com/RoeeHashai/FacebookASP-BE.git
    cd FacebookASP-BE
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Environment Configuration:**
    - Navigate to the project root directory and create a `config` directory with `.env` and `.env.local` files:
        ```sh
        mkdir config && cd config
        touch .env .env.local
        cd ..
        ```
    - Open both `.env` and `.env.local` files in a text editor and populate them with your MongoDB connection string, server port, and JWT secret as follows (replace placeholder values with actual data):
        ```plaintext
        CONNECTION_STRING='mongodb://localhost:27017/'
        PORT=8080
        JWT_SECRET='your_secret_key_here'
        ```
    Note: The `.env.local` file can be used for overriding environment variables locally.

### Running the Application
- **Web Application Setup**:
    1. **Start the MongoDB Server** (skip if MongoDB is already running):
        - Open the terminal and start the MongoDB server with the following command (replace the path with your MongoDB server's data directory path):
            ```sh
            mongod --dbpath=/path/to/your/mongodb/data
            ```

    2. **Populate the Database**:
        - From the root directory of the project, initialize the database with predefined data by running:
            ```sh
            node init-db.js
            ```

    3. **Start the Server**:
        - Launch the application server by executing:
            ```sh
            npm start
            ```

    4. **Access the Application**:
        - Open a web browser and navigate to `http://localhost:8080` to access the backend services.

- **Android App**: Users looking to access the platform via the Android app will need to download the app. The backend will integrate with the app, offering the same range of services as the web version.

For more information about the frontend functionalities and how they integrate with this backend, please visit the [Frontend Web App GitHub Repository](https://github.com/RoeeHashai/FacebookASP-WebApp-FE) and [Frontend Andriod App GitHub Repository](https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE).


## UI Screenshots
To give you a clearer view of our platform's functionality and design, below are screenshots of key user interfaces:


<img width="1508" alt="1" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/f642e858-096d-4349-ae7e-866029c34022">
<img width="1509" alt="2" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/6c428b0c-a589-4b9e-beb4-6fca017c8844">
<img width="1507" alt="3" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/6d96eb47-0f2f-45af-b806-d7d71642856f">
<img width="1512" alt="6" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/1779ce1f-17be-4310-b5ce-855ffbbe63d6">
<img width="1508" alt="4" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/a0fddc23-c2b9-42cf-a9ad-006ccd026b76">
<img width="1509" alt="5" src="https://github.com/RoeeHashai/FacebookASP-BE/assets/114341594/7d4cbdce-79bc-4eab-8af5-863d7870a24d">

<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/afd61af6-af3c-4221-b05d-0142c8327502" alt="Screenshot 1" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/4e53f6b7-fefe-4f43-a800-33d879bef428" alt="Screenshot 2" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/2086aadb-d286-4ef2-8fe1-98fb6457cd85" alt="Screenshot 3" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/c94b130f-9da1-4c07-b0d4-0d07202818cc" alt="Screenshot 4" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/b895f974-98d9-4cd3-ab2c-e712449d0208" alt="Screenshot 5" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/47ae69dc-853e-42bb-825d-ada098d46691" alt="Screenshot 6" width="300">
<img src="https://github.com/RoeeHashai/FacebookASP-AndroidApp-FE/assets/155381822/2a542d5b-505d-414a-b5a9-a115f1fe7a7d" alt="Screenshot 7" width="300">
