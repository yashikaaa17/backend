import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API is running successfully"
    });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Invalid JSON payload"
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(400).json({
            message: `User with this ${field} already exists`
        });
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((item) => item.message);
        return res.status(400).json({
            message: messages.join(", ")
        });
    }

    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal server error"
    });
});

export default app;
