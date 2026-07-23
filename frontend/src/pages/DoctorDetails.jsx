import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Building2,
    CalendarPlus,
    Clock4,
    GraduationCap,
    Mail,
    MapPin,
    Megaphone,
    Phone,
    Send,
    Stethoscope,
    UserRound,
    Users,
} from "lucide-react";

import { api, errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useQueueSocket } from "../hooks/useQueueSocket.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";

export default function DoctorDetails() {
    const { doctorId } = useParams();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [queue, setQueue] = useState(null); // { isOwner, appointments }
    const [bookingOpen, setBookingOpen] = useState(false);
    const [announceOpen, setAnnounceOpen] = useState(false);

    const isOwner = !!doctor?.isOwner;

    const loadDoctor = useCallback(async () => {
        try {
            const { data } = await api.get(`/doctors/${doctorId}`);
            setDoctor(data.data?.doctor);
        } catch (err) {
            toast.error(errorMessage(err, "Doctor not found"));
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    const loadAnnouncements = useCallback(async () => {
        try {
            const { data } = await api.get(`/doctors/${doctorId}/announcements`);
            setAnnouncements(data.data?.announcements ?? []);
        } catch {
            /* silent — announcements are non-critical */
        }
    }, [doctorId]);

    const loadQueue = useCallback(async () => {
        if (!user) {
            setQueue(null);
            return;
        }
        try {
            const { data } = await api.get(`/appointments/queue/${doctorId}`);
            setQueue(data.data);
        } catch (err) {
            // 403 means user hasn't booked yet — not an error worth shouting about
            if (err?.response?.status !== 403) {
                toast.error(errorMessage(err, "Could not load queue"));
            }
            setQueue(null);
        }
    }, [doctorId, user]);

    useEffect(() => {
        loadDoctor();
        loadAnnouncements();
    }, [loadDoctor, loadAnnouncements]);

    useEffect(() => {
        loadQueue();
    }, [loadQueue]);

    // Subscribe to live queue updates for this doctor
    useQueueSocket(doctorId, () => {
        loadQueue();
    });

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner label="Loading doctor…" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <EmptyState
                    icon={Stethoscope}
                    title="We couldn't find that doctor"
                    description="The link may be broken or the profile was removed."
                    action={
                        <Link to="/doctors" className="btn-primary">
                            Back to directory
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                to="/doctors"
                className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800"
            >
                <ArrowLeft size={14} />
                All doctors
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-12">
                {/* LEFT: profile */}
                <div className="lg:col-span-7">
                    <div className="card">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="grid size-16 place-items-center rounded-2xl bg-brand-50 font-display text-2xl font-semibold text-brand-700">
                                    {initials(doctor.fullname)}
                                </div>
                                <div>
                                    <h1 className="font-display text-2xl font-semibold text-ink-900">
                                        Dr. {doctor.fullname}
                                    </h1>
                                    <p className="text-sm text-brand-700">
                                        {doctor.specializations}
                                    </p>
                                    <p className="mt-1 text-xs text-ink-500">
                                        Joined{" "}
                                        {new Date(doctor.createdAt).toLocaleDateString(
                                            undefined,
                                            { month: "long", year: "numeric" }
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {!isOwner && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!user) {
                                                toast("Please sign in to book an appointment");
                                                return;
                                            }
                                            setBookingOpen(true);
                                        }}
                                        className="btn-primary"
                                    >
                                        <CalendarPlus size={16} />
                                        Book appointment
                                    </button>
                                )}
                                {isOwner && (
                                    <button
                                        type="button"
                                        onClick={() => setAnnounceOpen(true)}
                                        className="btn-outline"
                                    >
                                        <Megaphone size={16} />
                                        New announcement
                                    </button>
                                )}
                            </div>
                        </div>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Detail icon={Building2} label="Hospital" value={doctor.hospitalname} />
                            <Detail icon={MapPin} label="Address" value={doctor.address} />
                            <Detail icon={Mail} label="Email" value={doctor.email} />
                            <Detail icon={Phone} label="Phone" value={doctor.phone} />
                            <Detail
                                icon={GraduationCap}
                                label="Qualifications"
                                value={doctor.qualifications}
                            />
                            <Detail icon={UserRound} label="Gender" value={doctor.gender} />
                        </dl>

                        {doctor.bio ? (
                            <p className="mt-6 rounded-2xl bg-bone p-4 text-sm leading-relaxed text-ink-700">
                                {doctor.bio}
                            </p>
                        ) : null}
                    </div>

                    <div className="card mt-6">
                        <header className="mb-4 flex items-center justify-between">
                            <h2 className="font-display text-lg font-semibold text-ink-900">
                                Availability
                            </h2>
                            <span className="badge bg-brand-50 text-brand-700">
                                <Clock4 size={12} />
                                Weekly schedule
                            </span>
                        </header>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {doctor.availability?.map((slot) => (
                                <li
                                    key={slot.day}
                                    className="flex items-center justify-between rounded-xl border border-ink-100 bg-bone/60 px-4 py-2.5 text-sm"
                                >
                                    <span className="font-medium text-ink-800">{slot.day}</span>
                                    <span className="font-mono text-xs text-ink-600">
                                        {slot.start} – {slot.end}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* RIGHT: queue + announcements */}
                <div className="space-y-6 lg:col-span-5">
                    <QueuePanel
                        queue={queue}
                        isOwner={isOwner}
                        onUpdate={loadQueue}
                        userId={user?.id}
                    />
                    <AnnouncementsPanel announcements={announcements} />
                </div>
            </div>

            <BookingModal
                open={bookingOpen}
                onClose={() => setBookingOpen(false)}
                doctorId={doctorId}
                onBooked={() => {
                    setBookingOpen(false);
                    loadQueue();
                }}
            />
            <AnnouncementModal
                open={announceOpen}
                onClose={() => setAnnounceOpen(false)}
                doctorId={doctorId}
                onCreated={() => {
                    setAnnounceOpen(false);
                    loadAnnouncements();
                }}
            />
        </section>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-bone text-brand-600">
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wider text-ink-500">
                    {label}
                </dt>
                <dd className="truncate text-sm font-medium text-ink-900">{value}</dd>
            </div>
        </div>
    );
}

function QueuePanel({ queue, isOwner, onUpdate, userId }) {
    if (!queue) {
        return (
            <div className="card">
                <header className="mb-3 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-ink-900">
                        Live queue
                    </h2>
                    <span className="badge bg-ink-100 text-ink-600">Hidden</span>
                </header>
                <p className="text-sm text-ink-600">
                    Book an appointment with this doctor to see today's live queue.
                </p>
            </div>
        );
    }

    const { appointments } = queue;
    const active = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");
    const myAppt = userId ? appointments.find((a) => a.bookedBy === userId) : null;
    const myPosition = myAppt
        ? active.findIndex((a) => a._id === myAppt._id)
        : -1;

    return (
        <div className="card">
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-lg font-semibold text-ink-900">
                        Live queue
                    </h2>
                    <p className="text-xs text-ink-500">Updates in real time</p>
                </div>
                <span className="badge bg-brand-50 text-brand-700">
                    <span className="live-dot" />
                    Live
                </span>
            </header>

            {myAppt && myPosition >= 0 && (
                <div className="mb-5 rounded-2xl bg-brand-50 p-4 text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-brand-700">
                        Your queue number
                    </p>
                    <p className="mt-1 font-display text-5xl font-semibold tracking-tight text-brand-700">
                        {myAppt.queueNumber}
                    </p>
                    <p className="mt-1 text-sm text-brand-800">
                        {myPosition === 0
                            ? "You're up next!"
                            : `${myPosition} ${myPosition === 1 ? "patient" : "patients"} ahead of you`}
                    </p>
                </div>
            )}

            {appointments.length === 0 ? (
                <p className="rounded-xl bg-bone px-4 py-6 text-center text-sm text-ink-600">
                    No appointments booked today yet.
                </p>
            ) : (
                <ul className="space-y-2">
                    {appointments.map((a) => (
                        <li
                            key={a._id}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                                a.bookedBy === userId
                                    ? "bg-brand-50 ring-1 ring-brand-200"
                                    : "bg-white border border-ink-100"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="grid size-7 place-items-center rounded-full bg-ink-100 font-mono text-xs font-semibold text-ink-700">
                                    {a.queueNumber}
                                </span>
                                <span className="font-medium text-ink-800">
                                    {isOwner || a.bookedBy === userId
                                        ? a.patientName
                                        : maskName(a.patientName)}
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={a.status} />
                                {isOwner && a.status !== "Completed" && a.status !== "Cancelled" && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await api.patch(
                                                    `/appointments/${a._id}/status`,
                                                    {
                                                        status:
                                                            a.status === "Pending"
                                                                ? "CheckedIn"
                                                                : "Completed",
                                                    }
                                                );
                                                onUpdate?.();
                                            } catch (err) {
                                                toast.error(
                                                    errorMessage(err, "Could not update")
                                                );
                                            }
                                        }}
                                        className="rounded-lg border border-ink-200 px-2 py-1 text-xs font-medium text-ink-700 hover:border-brand-400 hover:text-brand-700"
                                    >
                                        {a.status === "Pending" ? "Check in" : "Mark done"}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <p className="mt-4 flex items-center gap-2 text-xs text-ink-500">
                <Users size={12} />
                {active.length} active · {appointments.length - active.length} done
            </p>
        </div>
    );
}

const maskName = (n) => {
    const parts = (n || "").split(" ");
    return parts.map((p) => (p[0] || "") + "•".repeat(Math.max(p.length - 1, 0))).join(" ");
};

function AnnouncementsPanel({ announcements }) {
    return (
        <div className="card">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink-900">
                    Announcements
                </h2>
                <span className="badge bg-amber-100 text-amber-800">
                    <Megaphone size={12} />
                    Auto-expires in 24h
                </span>
            </header>
            {announcements.length === 0 ? (
                <p className="rounded-xl bg-bone px-4 py-6 text-center text-sm text-ink-600">
                    No active announcements.
                </p>
            ) : (
                <ul className="space-y-3">
                    {announcements.map((a) => (
                        <li
                            key={a._id}
                            className="rounded-xl border border-amber-100 bg-amber-50/60 p-4"
                        >
                            <p className="text-sm leading-relaxed text-ink-800">
                                {a.message}
                            </p>
                            <p className="mt-2 text-xs text-ink-500">
                                {new Date(a.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function BookingModal({ open, onClose, doctorId, onBooked }) {
    const [form, setForm] = useState({
        patientName: "",
        age: "",
        gender: "Male",
        contact: "",
    });
    const [busy, setBusy] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post("/appointments/book", {
                doctorId,
                ...form,
                age: Number(form.age),
            });
            toast.success("Appointment booked!");
            onBooked?.();
        } catch (err) {
            toast.error(errorMessage(err, "Could not book appointment"));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Book an appointment"
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-ghost">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="booking-form"
                        disabled={busy}
                        className="btn-primary"
                    >
                        <CalendarPlus size={16} />
                        {busy ? "Booking…" : "Confirm booking"}
                    </button>
                </>
            }
        >
            <form id="booking-form" onSubmit={submit} className="space-y-4">
                <div>
                    <label className="field-label">Patient name</label>
                    <input
                        required
                        value={form.patientName}
                        onChange={set("patientName")}
                        className="field-input"
                        placeholder="Aarav Sharma"
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="field-label">Age</label>
                        <input
                            required
                            type="number"
                            min="0"
                            max="120"
                            value={form.age}
                            onChange={set("age")}
                            className="field-input"
                            placeholder="32"
                        />
                    </div>
                    <div>
                        <label className="field-label">Gender</label>
                        <select
                            value={form.gender}
                            onChange={set("gender")}
                            className="field-input"
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="field-label">Contact phone (10 digits)</label>
                    <input
                        required
                        value={form.contact}
                        onChange={set("contact")}
                        className="field-input"
                        placeholder="9876543210"
                        pattern="\d{10}"
                    />
                </div>
                <p className="text-xs text-ink-500">
                    Booking is only allowed during the doctor's availability window.
                </p>
            </form>
        </Modal>
    );
}

function AnnouncementModal({ open, onClose, doctorId, onCreated }) {
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post(`/doctors/${doctorId}/announcements`, { message });
            toast.success("Announcement posted");
            setMessage("");
            onCreated?.();
        } catch (err) {
            toast.error(errorMessage(err, "Could not post announcement"));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Post an announcement"
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-ghost">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="announcement-form"
                        disabled={busy || !message.trim()}
                        className="btn-primary"
                    >
                        <Send size={16} />
                        {busy ? "Posting…" : "Post"}
                    </button>
                </>
            }
        >
            <form id="announcement-form" onSubmit={submit} className="space-y-3">
                <div>
                    <label className="field-label">Message</label>
                    <textarea
                        required
                        rows={4}
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="field-input resize-none"
                        placeholder="e.g. Running 30 mins late today, apologies for the inconvenience."
                    />
                    <p className="mt-1 text-right text-xs text-ink-400">
                        {message.length} / 500
                    </p>
                </div>
                <p className="text-xs text-ink-500">
                    Announcements automatically disappear after 24 hours.
                </p>
            </form>
        </Modal>
    );
}

const initials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "Dr";
