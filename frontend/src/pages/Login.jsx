import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { login, user } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (user) return <Navigate to="/" replace />;

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const result = await login(form.email, form.password);
        setBusy(false);
        if (result.ok) {
            toast.success("Welcome back!");
            navigate(location.state?.from || "/", { replace: true });
        } else {
            toast.error(result.message);
        }
    };

    return (
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Welcome back
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-900">
                    Your queue is waiting.
                </h1>
                <p className="mt-3 max-w-sm text-ink-600">
                    Sign in to book new appointments, track your live queue position, and view
                    upcoming visits.
                </p>
                <div className="mt-10 rounded-3xl border border-ink-100 bg-white/80 p-6 shadow-soft">
                    <p className="text-sm text-ink-700">
                        “MediQueue cut my hospital wait from two hours to ten minutes — I
                        finished a coffee and walked straight in.”
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-500">
                        — Patient, Apollo Bengaluru
                    </p>
                </div>
            </div>

            <div className="card mx-auto w-full max-w-md">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Sign in</h2>
                <p className="mt-1 text-sm text-ink-500">
                    Enter your account email and password.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="field-label">Email</label>
                        <input
                            required
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="field-input"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="field-label">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={show ? "text" : "password"}
                                autoComplete="current-password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="field-input pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((v) => !v)}
                                className="absolute inset-y-0 right-3 my-auto text-ink-400 hover:text-ink-700"
                                aria-label={show ? "Hide password" : "Show password"}
                            >
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={busy} className="btn-primary w-full">
                        <LogIn size={16} />
                        {busy ? "Signing in…" : "Sign in"}
                    </button>
                </form>
                <p className="mt-5 text-center text-sm text-ink-600">
                    New to MediQueue?{" "}
                    <Link to="/signup" className="font-medium text-brand-700 hover:text-brand-800">
                        Create an account
                    </Link>
                </p>
            </div>
        </section>
    );
}
