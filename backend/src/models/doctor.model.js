import mongoose from "mongoose";
import validator from "validator";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/; // 24h time validator

const availabilitySchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            required: true,
        },
        start: {
            type: String,
            required: true,
            validate: { validator: (v) => HHMM.test(v), message: "Use HH:mm 24-hour format" },
        },
        end: {
            type: String,
            required: true,
            validate: { validator: (v) => HHMM.test(v), message: "Use HH:mm 24-hour format" },
        },
    },
    { _id: false }
);

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        fullname: { type: String, required: [true, "Full name is required"], trim: true },
        hospitalname: {
            type: String,
            required: [true, "Hospital name is required"],
            trim: true,
            index: true,
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
            required: [true, "Phone is required"],
            validate: {
                validator: (v) => /^\d{10}$/.test(v),
                message: "Phone number must be exactly 10 digits",
            },
        },
        address: { type: String, required: true, trim: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        specializations: { type: String, required: true, trim: true, index: true },
        qualifications: { type: String, required: true, trim: true },
        availability: {
            type: [availabilitySchema],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "Provide at least one day of availability",
            },
        },
        bio: { type: String, default: "", maxlength: 1000 },
        photoUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

// Search-friendly text index
doctorSchema.index({ fullname: "text", specializations: "text", hospitalname: "text" });

export const Doctor = mongoose.model("Doctor", doctorSchema);
