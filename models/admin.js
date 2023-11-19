// Import necessary modules
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Define Schema for Admin
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 32
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        contact: {
            type: Number
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "admin" // You can customize the default role as needed
        }
    }
);

// Create Admin model
const Admin = mongoose.model("admin", adminSchema);

// Function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ADMIN_SECRET_KEY);
};

// Export Admin model and generateToken function
export { Admin, generateToken };
