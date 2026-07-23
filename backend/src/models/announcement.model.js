import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
            index: true,
        },
        message: {
            type: String,
            required: [true, "Announcement message is required"],
            maxlength: [500, "Announcements cannot exceed 500 characters"],
            trim: true,
        },
        // Auto-deletes after 24 hours via TTL index
        createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
    },
    { versionKey: false }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
