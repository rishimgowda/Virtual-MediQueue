import { z } from "zod";

const phoneRegex = /^\d{10}$/;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const schemas = {
    register: z.object({
        body: z.object({
            username: z.string().min(3).max(40),
            email: z.string().email(),
            phone: z.string().regex(phoneRegex, "Phone must be 10 digits"),
            password: z.string().min(8, "Password must be at least 8 characters"),
            role: z.enum(["patient", "doctor"]).optional(),
        }),
    }),

    login: z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(1),
        }),
    }),

    bookAppointment: z.object({
        body: z.object({
            doctorId: objectId,
            patientName: z.string().min(2).max(80),
            age: z.coerce.number().int().min(0).max(120),
            gender: z.enum(["Male", "Female", "Other"]),
            contact: z.string().regex(phoneRegex, "Contact must be 10 digits"),
        }),
    }),

    registerDoctor: z.object({
        body: z.object({
            fullname: z.string().min(2).max(80),
            hospitalname: z.string().min(2).max(120),
            email: z.string().email(),
            phone: z.string().regex(phoneRegex),
            address: z.string().min(3).max(200),
            gender: z.enum(["Male", "Female", "Other"]),
            specializations: z.string().min(2).max(120),
            qualifications: z.string().min(2).max(200),
            bio: z.string().max(1000).optional(),
            availability: z
                .array(
                    z.object({
                        day: z.enum([
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                        ]),
                        start: z.string().regex(HHMM, "Use HH:mm 24-hour format"),
                        end: z.string().regex(HHMM, "Use HH:mm 24-hour format"),
                    })
                )
                .min(1, "Add at least one availability window"),
        }),
    }),

    contactUs: z.object({
        body: z.object({
            firstName: z.string().min(2),
            lastName: z.string().min(2),
            email: z.string().email(),
            phone: z.string().regex(phoneRegex),
            message: z.string().min(10).max(2000),
        }),
    }),

    announcement: z.object({
        body: z.object({
            message: z.string().min(1).max(500),
        }),
        params: z.object({ doctorId: objectId }),
    }),

    doctorIdParam: z.object({
        params: z.object({ doctorId: objectId }),
    }),

    appointmentIdParam: z.object({
        params: z.object({ appointmentId: objectId }),
    }),
};

/*Client sends request
        ↓
Validate request using schema
        ↓
Valid?
     ↙      ↘
   Yes      No
    ↓        ↓
Controller   Return Validation Error*/
