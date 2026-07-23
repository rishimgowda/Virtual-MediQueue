import { Doctor } from "../models/doctor.model.js";
import { Announcement } from "../models/announcement.model.js";
import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";

/**
 * Register a doctor profile. Caller must be authenticated; the doctor
 * profile is owned by req.user.id, which is also promoted to role=doctor.
 */
export const registerDoctor = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const existing = await Doctor.findOne({ $or: [{ email: req.body.email }, { userId }] });
    if (existing) {
        throw new ApiError(409, "Doctor profile already exists for this user or email");
    }

    const doctor = await Doctor.create({ ...req.body, userId });

    // Promote the user to doctor role
    await User.findByIdAndUpdate(userId, { role: "doctor" });

    sendResponse(res, 201, { doctor }, "Doctor registered successfully");
});

export const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    sendResponse(res, 200, { doctors });
});

export const getDoctorById = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) throw new ApiError(404, "Doctor not found");

    // Mark whether the requester owns this doctor profile
    const isOwner = req.user?.id && doctor.userId.toString() === req.user.id;
    sendResponse(res, 200, { doctor: { ...doctor, isOwner: !!isOwner } });
});

export const searchDoctors = asyncHandler(async (req, res) => {
    const { q = "", specialization = "" } = req.query;
    const filter = {};
    if (q) filter.fullname = new RegExp(q, "i");
    if (specialization && specialization !== "All") {
        filter.specializations = new RegExp(specialization, "i");
    }
    const doctors = await Doctor.find(filter).sort({ fullname: 1 });
    sendResponse(res, 200, { doctors });
});

export const listAnnouncements = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const announcements = await Announcement.find({ doctorId }).sort({ createdAt: -1 });
    sendResponse(res, 200, { announcements });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    if (doctor.userId.toString() !== req.user.id) {
        throw new ApiError(403, "You can only post announcements on your own profile");
    }
    const announcement = await Announcement.create({
        doctorId,
        message: req.body.message,
    });
    sendResponse(res, 201, { announcement }, "Announcement posted");
});
