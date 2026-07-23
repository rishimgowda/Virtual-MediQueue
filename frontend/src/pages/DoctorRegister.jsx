import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Stethoscope, Trash2 } from "lucide-react";

import { api, errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function DoctorRegister() {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        fullname: "",
        hospitalname: "",
        email: "",
        phone: "",
        address: "",
        gender: "Male",
        specializations: "",
        qualifications: "",
        bio: "",
        availability: [{ day: "Monday", start: "09:00", end: "17:00" }],
    });

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const updateSlot = (idx, key, value) => {
        setForm((f) => ({
            ...f,
            availability: f.availability.map((slot, i) =>
                i === idx ? { ...slot, [key]: value } : slot
            ),
        }));
    };

    const addSlot = () => {
        const used = new Set(form.availability.map((s) => s.day));
        const next = DAYS.find((d) => !used.has(d)) || "Monday";
        setForm((f) => ({
            ...f,
            availability: [...f.availability, { day: next, start: "09:00", end: "17:00" }],
        }));
    };

    const removeSlot = (idx) => {
        setForm((f) => ({
            ...f,
            availability: f.availability.filter((_, i) => i !== idx),
        }));
    };

    const submit = async (e) => {
        e.preventDefault();

        // Validate slots
        for (const s of form.availability) {
            if (s.start >= s.end) {
                toast.error(`On ${s.day}, end time must be after start time`);
                return;
            }
        }

        setBusy(true);
        try {
            await api.post("/doctors/register", form);
            await refreshUser();
            toast.success("Doctor profile created!");
            navigate("/doctors");
        } catch (err) {
            toast.error(errorMessage(err, "Could not register"));
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Doctor onboarding
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    Register your practice with MediQueue.
                </h1>
                <p className="mt-3 max-w-2xl text-ink-600">
                    Add your hospital, contact details, and weekly availability. Patients
                    will be able to book and join your live queue immediately.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8">
                <div className="card">
                    <h2 className="font-display text-lg font-semibold text-ink-900">
                        Basic information
                    </h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="field-label">Full name</label>
                            <input
                                required
                                value={form.fullname}
                                onChange={set("fullname")}
                                className="field-input"
                                placeholder="Anika Rao"
                            />
                        </div>
                        <div>
                            <label className="field-label">Hospital / Clinic</label>
                            <input
                                required
                                value={form.hospitalname}
                                onChange={set("hospitalname")}
                                className="field-input"
                                placeholder="Apollo Hospital, Bengaluru"
                            />
                        </div>
                        <div>
                            <label className="field-label">Email</label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                className="field-input"
                                placeholder="anika@example.com"
                            />
                        </div>
                        <div>
                            <label className="field-label">Phone (10 digits)</label>
                            <input
                                required
                                value={form.phone}
                                onChange={set("phone")}
                                className="field-input"
                                placeholder="9876543210"
                                pattern="\d{10}"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="field-label">Address</label>
                            <input
                                required
                                value={form.address}
                                onChange={set("address")}
                                className="field-input"
                                placeholder="154, Bannerghatta Road, Bengaluru"
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
                        <div>
                            <label className="field-label">Specialization</label>
                            <input
                                required
                                value={form.specializations}
                                onChange={set("specializations")}
                                className="field-input"
                                placeholder="Cardiology"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="field-label">Qualifications</label>
                            <input
                                required
                                value={form.qualifications}
                                onChange={set("qualifications")}
                                className="field-input"
                                placeholder="MBBS, MD (Cardiology), AIIMS"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="field-label">
                                Short bio <span className="text-ink-400">(optional)</span>
                            </label>
                            <textarea
                                rows={3}
                                value={form.bio}
                                onChange={set("bio")}
                                className="field-input resize-none"
                                placeholder="A brief introduction patients will see on your profile."
                                maxLength={1000}
                            />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold text-ink-900">
                            Weekly availability
                        </h2>
                        <button
                            type="button"
                            onClick={addSlot}
                            disabled={form.availability.length >= 7}
                            className="btn-outline text-sm"
                        >
                            <Plus size={14} />
                            Add day
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-ink-500">
                        Patients can only book during these windows.
                    </p>

                    <ul className="mt-5 space-y-3">
                        {form.availability.map((slot, idx) => (
                            <li
                                key={idx}
                                className="grid gap-3 rounded-xl border border-ink-100 bg-bone/60 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                            >
                                <select
                                    value={slot.day}
                                    onChange={(e) => updateSlot(idx, "day", e.target.value)}
                                    className="field-input"
                                >
                                    {DAYS.map((d) => (
                                        <option key={d}>{d}</option>
                                    ))}
                                </select>
                                <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                        updateSlot(idx, "start", e.target.value)
                                    }
                                    className="field-input"
                                    required
                                />
                                <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => updateSlot(idx, "end", e.target.value)}
                                    className="field-input"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSlot(idx)}
                                    disabled={form.availability.length === 1}
                                    className="grid place-items-center rounded-xl border border-ink-200 bg-white px-3 py-2 text-ink-500 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-40"
                                    aria-label="Remove this slot"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-ghost"
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={busy} className="btn-primary">
                        <Stethoscope size={16} />
                        {busy ? "Submitting…" : "Register profile"}
                    </button>
                </div>
            </form>
        </section>
    );
}
