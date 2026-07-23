import { Router } from "express";
import {
    bookAppointment,
    getQueueForDoctor,
    updateAppointmentStatus,
    myAppointments,
} from "../controllers/appointment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureWithinAvailability } from "../middleware/availability.js";
import { validate } from "../middleware/validate.js";
import { schemas } from "../validators/schemas.js";

const router = Router();

router.post(
    "/book",
    requireAuth,
    validate(schemas.bookAppointment),
    ensureWithinAvailability,
    bookAppointment
);

router.get("/me", requireAuth, myAppointments);

router.get(
    "/queue/:doctorId",
    requireAuth,
    validate(schemas.doctorIdParam),
    getQueueForDoctor
);

router.patch(
    "/:appointmentId/status",
    requireAuth,
    validate(schemas.appointmentIdParam),
    updateAppointmentStatus
);

export default router;
