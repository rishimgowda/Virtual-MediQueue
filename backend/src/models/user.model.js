import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import { config } from "../config/index.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [40, "Username cannot exceed 40 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            validate: {
                validator: (v) => /^\d{10}$/.test(v),
                message: "Phone number must be exactly 10 digits",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // never returned by default
        },
        role: {
            type: String,
            enum: ["patient", "doctor", "admin"],
            default: "patient",
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

// Hash password automatically before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds);
    next();
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
    const { _id, username, email, phone, role, createdAt } = this;
    return { id: _id, username, email, phone, role, createdAt };
};

export const User = mongoose.model("User", userSchema);
