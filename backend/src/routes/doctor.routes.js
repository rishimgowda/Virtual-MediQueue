import { Router } from "express";
import {
    registerDoctor,
    getAllDoctors,
    getDoctorById,
    searchDoctors,
    listAnnouncements,
    createAnnouncement,
} from "../controllers/doctor.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { schemas } from "../validators/schemas.js";

const router = Router();

router.get("/", getAllDoctors);
router.get("/search", searchDoctors);
router.post("/register", requireAuth, validate(schemas.registerDoctor), registerDoctor);
router.get("/:doctorId", validate(schemas.doctorIdParam), getDoctorById);
router.get(
    "/:doctorId/announcements",
    validate(schemas.doctorIdParam),
    listAnnouncements
);
router.post(
    "/:doctorId/announcements",
    requireAuth,
    validate(schemas.announcement),
    createAnnouncement
);

export default router;
