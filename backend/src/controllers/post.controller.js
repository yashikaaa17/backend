import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

const createPost = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body cannot be empty"
            });
        }

        const { name, description, age } = req.body;

        if (!name || !description || age === undefined || age === null) {
            return res.status(400).json({
                message: "All fields are required: name, description, and age"
            });
        }

        if (typeof name !== "string" || typeof description !== "string") {
            return res.status(400).json({
                message: "Name and description must be strings"
            });
        }

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedDescription) {
            return res.status(400).json({
                message: "Name and description cannot be empty or only spaces"
            });
        }

        const ageValue = Number(age);
        if (isNaN(ageValue) || ageValue < 1 || ageValue > 150) {
            return res.status(400).json({
                message: "Age must be a number between 1 and 150"
            });
        }

        const post = await Post.create({
            name: trimmedName,
            description: trimmedDescription,
            age: ageValue
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data provided for update"
            });
        }

        const { name, description, age } = req.body;
        const updateData = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Name must be a non-empty string"
                });
            }
            updateData.name = name.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({
                    message: "Description must be a non-empty string"
                });
            }
            updateData.description = description.trim();
        }

        if (age !== undefined) {
            const ageValue = Number(age);
            if (isNaN(ageValue) || ageValue < 1 || ageValue > 150) {
                return res.status(400).json({
                    message: "Age must be a number between 1 and 150"
                });
            }
            updateData.age = ageValue;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedPost) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export {
    createPost,
    getPosts,
    updatePost,
    deletePost
};
