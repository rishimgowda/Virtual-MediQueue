import mongoose from "mongoose";

/**
 * Per-doctor, per-day counter used to assign monotonically increasing
 * queue numbers without race conditions. The unique index guarantees
 * findOneAndUpdate(..., { upsert: true }) is atomic.
 */
const counterSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date: { type: Date, required: true },
        count: { type: Number, default: 0 },
    },
    { versionKey: false }
);
counterSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export const Counter = mongoose.model("Counter", counterSchema);

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
            index: true,
        },
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        patientName: { type: String, required: true, trim: true },
        age: {
            type: Number,
            required: true,
            min: [0, "Age cannot be negative"],
            max: [120, "Age cannot exceed 120"],
        },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        contact: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^\d{10}$/.test(v),
                message: "Contact must be exactly 10 digits",
            },
        },
        date: { type: Date, required: true, default: Date.now },
        status: {
            type: String,
            enum: ["Pending", "CheckedIn", "Completed", "Cancelled"],
            default: "Pending",
            index: true,
        },
        queueNumber: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, date: 1 });

appointmentSchema.pre("save", async function (next) {
    if (!this.isNew) return next();
    try {
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const counter = await Counter.findOneAndUpdate(
            { doctorId: this.doctorId, date: todayDate },
            { $inc: { count: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        this.queueNumber = counter.count;
        next();
    } catch (err) {
        next(err);
    }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
