import { startOfDay, endOfDay } from "date-fns";
import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { emitQueueUpdate } from "../sockets/index.js";

export const bookAppointment = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { doctorId, patientName, age, gender, contact } = req.body;

    // Prevent duplicate booking with the same doctor today
    const today = new Date();
    const existing = await Appointment.findOne({
        doctorId,
        bookedBy: userId,
        date: { $gte: startOfDay(today), $lte: endOfDay(today) },
        status: { $in: ["Pending", "CheckedIn"] },
    });
    if (existing) {
        throw new ApiError(
            409,
            "You already have an active appointment with this doctor today"
        );
    }

    const appointment = await Appointment.create({
        doctorId,
        patientName,
        age,
        gender,
        contact,
        bookedBy: userId,
    });

    // Notify everyone watching this doctor's queue
    emitQueueUpdate(doctorId, { type: "created", appointment });

    sendResponse(res, 201, { appointment }, "Appointment booked successfully");
});

/**
 * Returns today's queue for a doctor.
 * - The owning doctor sees the full queue.
 * - Any patient who has booked today sees the full queue (so they can track position).
 * - Otherwise, 403.
 */
export const getQueueForDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const userId = req.user.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(404, "Doctor not found");

    const today = new Date();
    const range = { $gte: startOfDay(today), $lte: endOfDay(today) };

    const isOwner = doctor.userId.toString() === userId;

    if (!isOwner) {
        const userHasAppt = await Appointment.exists({
            doctorId,
            bookedBy: userId,
            date: range,
        });
        if (!userHasAppt) {
            throw new ApiError(
                403,
                "You can only view this queue after booking an appointment today"
            );
        }
    }

    const appointments = await Appointment.find({ doctorId, date: range })
        .sort({ queueNumber: 1 })
        .lean();

    sendResponse(res, 200, { isOwner, appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const allowed = ["CheckedIn", "Completed", "Cancelled"];
    if (!allowed.includes(status)) {
        throw new ApiError(400, `Status must be one of: ${allowed.join(", ")}`);
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) throw new ApiError(404, "Appointment not found");

    // Only the owning doctor (or the booking user, if cancelling) may update
    const doctor = await Doctor.findById(appt.doctorId);
    const isOwner = doctor && doctor.userId.toString() === req.user.id;
    const isBooker = appt.bookedBy.toString() === req.user.id;

    if (status === "Cancelled") {
        if (!isOwner && !isBooker) throw new ApiError(403, "Not authorized");
    } else if (!isOwner) {
        throw new ApiError(403, "Only the doctor can change this status");
    }

    appt.status = status;
    await appt.save();

    emitQueueUpdate(appt.doctorId.toString(), { type: "updated", appointment: appt });

    sendResponse(res, 200, { appointment: appt }, "Appointment updated");
});

export const myAppointments = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const appointments = await Appointment.find({ bookedBy: userId })
        .sort({ createdAt: -1 })
        .populate({ path: "doctorId", select: "fullname hospitalname specializations" })
        .lean();

    const shaped = appointments.map((a) => ({
        ...a,
        doctor: a.doctorId,
        doctorId: a.doctorId?._id,
    }));

    sendResponse(res, 200, { appointments: shaped });
});
