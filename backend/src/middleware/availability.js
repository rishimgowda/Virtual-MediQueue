import { Doctor } from "../models/doctor.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Verifies that the doctor referenced in req.body.doctorId is currently
 * within one of their availability windows. Hop-friendly: stores the
 * doctor on req so the controller doesn't refetch.
 */
export const ensureWithinAvailability = async (req, _res, next) => {
    try {
        const { doctorId } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return next(new ApiError(404, "Doctor not found"));

        const now = new Date();
        const currentDay = now.toLocaleString("en-US", { weekday: "long" });
        const currentTime = now.toTimeString().slice(0, 5); // HH:mm

        const slot = doctor.availability.find((a) => a.day === currentDay);
        if (!slot) {
            return next(new ApiError(400, `Doctor is not available today (${currentDay})`));
        }
        if (currentTime < slot.start || currentTime > slot.end) {
            return next(
                new ApiError(
                    400,
                    `Doctor is only available between ${slot.start} and ${slot.end} on ${currentDay}`
                )
            );
        }

        req.doctor = doctor;
        next();
    } catch (err) {
        next(err);
    }
};
