# Intro to Backend — Node.js, Express & MongoDB Atlas

A beginner-friendly backend project built with Node.js, Express.js, and MongoDB Atlas. This project follows the [freeCodeCamp Intro to Backend Development tutorial](https://www.youtube.com/watch?v=KOutPbKc9UM&t=2s) and demonstrates user authentication (register, login, logout) and complete CRUD operations for posts using the **Model-Route-Controller (MRC)** architecture.

---

## 🛠️ Technologies Used

| Technology       | Purpose                                    |
|------------------|--------------------------------------------|
| **Node.js**      | JavaScript runtime for the server          |
| **Express.js**   | Web framework for building REST APIs       |
| **MongoDB Atlas**| Cloud-hosted NoSQL database                |
| **Mongoose**     | ODM (Object Document Mapper) for MongoDB   |
| **bcrypt**       | Secure password hashing                    |
| **dotenv**       | Load environment variables from `.env`     |
| **Nodemon**      | Auto-restart server during development     |
| **Postman**      | API testing tool                           |

---

## 📁 Project Directory Structure

```
Backend-Project-/
├── backend/
│   └── src/
│       ├── app.js                      # Express app setup + middleware + route registration
│       ├── index.js                    # Entry point: load env, connect DB, start server
│       ├── config/
│       │   ├── constants.js            # DB_NAME constant
│       │   └── database.js             # MongoDB connection logic using Mongoose
│       ├── controllers/
│       │   ├── user.controller.js      # Register, Login, Logout logic
│       │   └── post.controller.js      # CRUD logic for posts
│       ├── models/
│       │   ├── user.model.js           # Mongoose schema for User (with bcrypt hashing)
│       │   └── post.model.js           # Mongoose schema for Post
│       └── routes/
│           ├── user.route.js           # User API routes
│           └── post.route.js           # Post API routes
├── postman/
│   └── intro-to-backend.postman_collection.json   # Postman collection for testing
├── .env.example                        # Example environment variables (safe to commit)
├── .gitignore                          # Git ignore rules (node_modules, .env excluded)
├── package.json
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier is enough)
- [Postman](https://www.postman.com/downloads/) for API testing

---

## 📦 Installing Dependencies

Clone the repository and install all required packages:

```bash
git clone https://github.com/samridh25cse/Backend-Project-.git
cd Backend-Project-
npm install
```

This installs:
- `express`, `mongoose`, `dotenv`, `bcrypt` as production dependencies
- `nodemon` as a development dependency

---

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new **cluster** (the free M0 tier works fine).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add your IP address (or allow access from anywhere: `0.0.0.0/0`).
5. Click **Connect** on your cluster → choose **Connect your application**.
6. Copy the connection string. It will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your actual database user credentials.

---

## ⚙️ Environment Variables Setup

1. In the root of the project, create a file called `.env`:
   ```bash
   touch .env
   ```

2. Open `.env` and add the following:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

   Replace `your_mongodb_atlas_connection_string` with the URI you copied from MongoDB Atlas. The database name `intro-to-backend` is automatically applied by the application.

> **Important:** Never commit `.env` to GitHub. It is already listed in `.gitignore`.

---

## 🚀 Starting the Server

**Development mode** (auto-restarts on file changes using Nodemon):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

If the connection is successful, you will see:
```
MongoDB connected successfully! DB Host: cluster0.xxxxx.mongodb.net
Server is running at port: 4000
```

You can verify the API is running by visiting: [http://localhost:4000](http://localhost:4000)

---

## 🔗 API Endpoint Reference

### Users — `/api/v1/users`

| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| POST   | `/api/v1/users/register`       | Register a new user       |
| POST   | `/api/v1/users/login`          | Log in with existing user |
| POST   | `/api/v1/users/logout`         | Log out                   |

### Posts — `/api/v1/posts`

| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| POST   | `/api/v1/posts/create`            | Create a new post       |
| GET    | `/api/v1/posts/getPosts`          | Fetch all posts         |
| PATCH  | `/api/v1/posts/update/:id`        | Update a post by ID     |
| DELETE | `/api/v1/posts/delete/:id`        | Delete a post by ID     |

---

## 📋 Example Request Bodies

**Register User:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login User:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Logout User:**
```json
{
  "email": "john@example.com"
}
```

**Create Post:**
```json
{
  "name": "My First Post",
  "description": "This is my first backend project post",
  "age": 20
}
```

**Update Post** (`PATCH /api/v1/posts/update/<post_id>`):
```json
{
  "name": "Updated Post",
  "description": "This is my updated post",
  "age": 21
}
```

---

## 📬 Postman Collection

A ready-to-use Postman collection is included in the `postman/` folder.

### How to Import

1. Open **Postman**.
2. Click **Import** (top left).
3. Choose **File** and select: `postman/intro-to-backend.postman_collection.json`
4. The collection will appear in your left sidebar with all 7 requests ready to use.

### How to Test

1. Make sure the server is running (`npm run dev`).
2. The collection uses `{{baseUrl}}` which is set to `http://localhost:4000` by default.
3. Run the **Register User** request first to create an account.
4. Use the returned `_id` from **Create Post** as the `POST_ID` in Update and Delete requests.
5. Each request includes test scripts that automatically verify the response status code and structure.

---

## 🏗️ MRC Architecture — How It Works

This project follows the **Model-Route-Controller (MRC)** pattern, which is a clean way to organize backend code:

```
Client Request
      │
      ▼
   Route  (user.route.js / post.route.js)
      │   Matches the URL and HTTP method, forwards to controller
      ▼
 Controller  (user.controller.js / post.controller.js)
      │   Handles business logic: validates input, calls the model
      ▼
   Model  (user.model.js / post.model.js)
      │   Defines the database schema and interacts with MongoDB
      ▼
  MongoDB Atlas (Database)
      │
      ▼
 Controller  → sends JSON response back to the client
```

| Layer       | File(s)                  | Responsibility                              |
|-------------|--------------------------|---------------------------------------------|
| **Model**   | `models/*.model.js`      | Data structure, schema validation, DB calls |
| **Route**   | `routes/*.route.js`      | URL endpoints mapped to controller functions|
| **Controller** | `controllers/*.controller.js` | Input validation, business logic, responses |

---

## 📌 Notes

- This project follows the **freeCodeCamp Intro to Backend Development tutorial** by Shivani.
  Watch here: [https://www.youtube.com/watch?v=KOutPbKc9UM&t=2s](https://www.youtube.com/watch?v=KOutPbKc9UM&t=2s)
- Passwords are securely hashed using **bcrypt** with 10 salt rounds and are never returned in API responses.
- This project does not implement JWT tokens or sessions — logout is stateless (the client is responsible for discarding credentials).
- The database name used is `intro-to-backend`.
