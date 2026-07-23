import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: [2, "First name must be at least 2 characters"],
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            minlength: [2, "Last name must be at least 2 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Provide a valid email"],
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^\d{10}$/.test(v),
                message: "Phone number must be exactly 10 digits",
            },
        },
        message: {
            type: String,
            required: true,
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
            trim: true,
        },
    },
    { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", contactSchema);
