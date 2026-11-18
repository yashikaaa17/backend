import { User } from "../models/user.model.js";

const registerUser = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body cannot be empty"
            });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Invalid input types"
            });
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (!trimmedUsername || !trimmedEmail || !password.trim()) {
            return res.status(400).json({
                message: "Fields cannot be empty or only spaces"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const normalizedEmail = trimmedEmail.toLowerCase();
        const normalizedUsername = trimmedUsername.toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {
            if (existingUser.email === normalizedEmail) {
                return res.status(400).json({
                    message: "User with this email already exists"
                });
            }
            return res.status(400).json({
                message: "User with this username already exists"
            });
        }

        const newUser = new User({
            username: normalizedUsername,
            email: normalizedEmail,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body cannot be empty"
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Invalid input types"
            });
        }

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password.trim()) {
            return res.status(400).json({
                message: "Email and password cannot be empty"
            });
        }

        const normalizedEmail = trimmedEmail.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const { email } = req.body || {};

        if (email) {
            if (typeof email !== "string" || !email.trim()) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }

            const user = await User.findOne({ email: email.trim().toLowerCase() });
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
        }

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    logoutUser as logoutuser
};
