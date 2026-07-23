import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    Activity,
    ArrowRight,
    Building2,
    CalendarCheck,
    ClipboardList,
    Clock4,
    Send,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";

import { api, errorMessage } from "../api/client.js";

const features = [
    {
        icon: CalendarCheck,
        title: "Book in seconds",
        body: "Find a doctor, pick an open slot, and get a queue number — no phone calls, no waiting rooms.",
    },
    {
        icon: Activity,
        title: "Live queue position",
        body: "Watch your spot move in real time over WebSockets. Walk in only when you're up.",
    },
    {
        icon: ShieldCheck,
        title: "Verified clinicians",
        body: "Every doctor is registered with credentials and availability windows enforced server-side.",
    },
    {
        icon: Building2,
        title: "Built for hospitals too",
        body: "Multi-doctor dashboards, daily counters, and announcements for every clinic.",
    },
];

const steps = [
    { n: "01", title: "Create your account", body: "A patient profile takes 30 seconds." },
    { n: "02", title: "Choose a specialist", body: "Search by name, specialty, or hospital." },
    { n: "03", title: "Track your queue", body: "Live updates whenever the queue moves." },
];

export default function Home() {
    return (
        <>
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <Contact />
        </>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-brand-50/80 to-transparent" />
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-24">
                <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                        <span className="live-dot" />
                        Real-time queue, zero hallway loitering
                    </span>
                    <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                        Skip the waiting room.{" "}
                        <span className="italic text-brand-700">Not the doctor.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
                        Virtual MediQueue digitises hospital queues so patients book online,
                        watch their position live, and walk in only when their number is called.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link to="/doctors" className="btn-primary">
                            Find a doctor
                            <ArrowRight size={16} />
                        </Link>
                        <Link to="/register/doctor" className="btn-outline">
                            <Stethoscope size={16} />
                            I'm a doctor
                        </Link>
                    </div>
                    <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-ink-100 pt-6 text-sm">
                        <div>
                            <dt className="text-ink-500">Avg. wait reduced</dt>
                            <dd className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                                47%
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-500">Hospitals served</dt>
                            <dd className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                                120+
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-500">Live updates</dt>
                            <dd className="mt-0.5 font-display text-2xl font-semibold text-ink-900">
                                &lt; 1s
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Hero card */}
                <div className="lg:col-span-5">
                    <HeroCard />
                </div>
            </div>
        </section>
    );
}

function HeroCard() {
    return (
        <div className="relative">
            <div className="absolute -left-6 -top-6 -z-10 size-32 rounded-full bg-brand-100/70 blur-2xl" />
            <div className="absolute -bottom-6 -right-6 -z-10 size-40 rounded-full bg-amber-100/70 blur-2xl" />

            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                            Live queue · Cardiology
                        </p>
                        <p className="font-display text-lg font-semibold text-ink-900">
                            Dr. Anika Rao
                        </p>
                    </div>
                    <span className="badge bg-brand-50 text-brand-700">
                        <span className="live-dot" />
                        Live
                    </span>
                </div>

                <div className="mt-5 rounded-2xl bg-bone p-5 text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                        Your queue number
                    </p>
                    <p className="mt-1 font-display text-6xl font-semibold tracking-tight text-brand-700">
                        12
                    </p>
                    <p className="mt-1 text-sm text-ink-600">3 patients ahead of you</p>
                </div>

                <ul className="mt-5 space-y-3">
                    {[
                        { n: 9, name: "Aarav S.", status: "Completed" },
                        { n: 10, name: "Priya M.", status: "In room" },
                        { n: 11, name: "Rohan K.", status: "Next up" },
                        { n: 12, name: "You", status: "Waiting" },
                    ].map((row) => (
                        <li
                            key={row.n}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                                row.name === "You"
                                    ? "bg-brand-50 ring-1 ring-brand-200"
                                    : "bg-white"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="grid size-7 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700">
                                    {row.n}
                                </span>
                                <span
                                    className={`font-medium ${
                                        row.name === "You" ? "text-brand-800" : "text-ink-800"
                                    }`}
                                >
                                    {row.name}
                                </span>
                            </span>
                            <span className="text-xs text-ink-500">{row.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function Stats() {
    return (
        <section className="border-y border-ink-100 bg-white/60">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
                {[
                    { icon: Users, label: "Patients served", value: "48K" },
                    { icon: Stethoscope, label: "Verified doctors", value: "1.2K" },
                    { icon: Clock4, label: "Hours saved", value: "162K" },
                    { icon: Activity, label: "Real-time uptime", value: "99.9%" },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <Icon size={20} className="text-brand-600" />
                        <p className="font-display text-2xl font-semibold text-ink-900">
                            {value}
                        </p>
                        <p className="text-xs text-ink-500">{label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Features() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Why MediQueue
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    Designed around the patient, not the paperwork.
                </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ icon: Icon, title, body }) => (
                    <div
                        key={title}
                        className="group rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                    >
                        <div className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                            <Icon size={20} />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="bg-ink-950 py-20 text-bone">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                            How it works
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                            Three steps. That's it.
                        </h2>
                    </div>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 self-start rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
                    >
                        Create your account
                        <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {steps.map((s) => (
                        <div
                            key={s.n}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                        >
                            <span className="font-display text-3xl font-semibold text-brand-300">
                                {s.n}
                            </span>
                            <h3 className="mt-3 font-display text-xl font-semibold">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-bone/70">
                                {s.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Contact() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post("/contact", form);
            toast.success("Thanks — we'll get back to you shortly.");
            setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
        } catch (err) {
            toast.error(errorMessage(err, "Could not send message"));
        } finally {
            setBusy(false);
        }
    };

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    return (
        <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-10 lg:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                        Get in touch
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900">
                        Questions about MediQueue?
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">
                        Whether you're a hospital admin, an independent practitioner, or a
                        patient — drop us a note and we'll respond personally.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-ink-700">
                        <li className="flex items-center gap-3">
                            <ClipboardList size={16} className="text-brand-600" />
                            Bookings, onboarding, partnerships
                        </li>
                        <li className="flex items-center gap-3">
                            <ShieldCheck size={16} className="text-brand-600" />
                            Security, privacy, and compliance
                        </li>
                    </ul>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="field-label">First name</label>
                            <input
                                required
                                value={form.firstName}
                                onChange={set("firstName")}
                                className="field-input"
                                placeholder="Aarav"
                            />
                        </div>
                        <div>
                            <label className="field-label">Last name</label>
                            <input
                                required
                                value={form.lastName}
                                onChange={set("lastName")}
                                className="field-input"
                                placeholder="Sharma"
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="field-label">Email</label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                className="field-input"
                                placeholder="you@example.com"
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
                            />
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={form.message}
                            onChange={set("message")}
                            className="field-input resize-none"
                            placeholder="Tell us what you're looking for…"
                        />
                    </div>
                    <button type="submit" disabled={busy} className="btn-primary w-full">
                        <Send size={16} />
                        {busy ? "Sending…" : "Send message"}
                    </button>
                </form>
            </div>
        </section>
    );
}
