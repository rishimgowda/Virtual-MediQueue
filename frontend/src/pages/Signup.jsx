import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
    const { register, user } = useAuth();
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    if (user) return <Navigate to="/" replace />;

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await register(form);
        setBusy(false);
        if (res.ok) {
            toast.success("Account created — welcome aboard!");
            navigate("/", { replace: true });
        } else {
            toast.error(res.message);
        }
    };

    return (
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Create an account
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-900">
                    Two minutes to a smarter waiting room.
                </h1>
                <p className="mt-3 max-w-sm text-ink-600">
                    Sign up to book appointments, see your queue update in real time, and
                    skip the physical waiting altogether.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-ink-700">
                    {[
                        "Book any registered doctor instantly",
                        "Get a daily queue number on the spot",
                        "Watch your position change live",
                        "Cancel or reschedule with one tap",
                    ].map((line) => (
                        <li key={line} className="flex items-center gap-3">
                            <span className="size-1.5 rounded-full bg-brand-500" />
                            {line}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card mx-auto w-full max-w-md">
                <h2 className="font-display text-2xl font-semibold text-ink-900">
                    Create your account
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                    Patient profile · upgrade to doctor anytime.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="field-label">Username</label>
                        <input
                            required
                            value={form.username}
                            onChange={set("username")}
                            className="field-input"
                            placeholder="aarav.sharma"
                            minLength={3}
                            maxLength={40}
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
                            pattern="\d{10}"
                        />
                    </div>
                    <div>
                        <label className="field-label">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={show ? "text" : "password"}
                                value={form.password}
                                onChange={set("password")}
                                className="field-input pr-10"
                                placeholder="At least 8 characters"
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShow((v) => !v)}
                                className="absolute inset-y-0 right-3 my-auto text-ink-400 hover:text-ink-700"
                            >
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={busy} className="btn-primary w-full">
                        <UserPlus size={16} />
                        {busy ? "Creating account…" : "Create account"}
                    </button>
                </form>
                <p className="mt-5 text-center text-sm text-ink-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
                        Sign in
                    </Link>
                </p>
            </div>
        </section>
    );
}
