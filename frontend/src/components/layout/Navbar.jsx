import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCircle2, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/doctors", label: "Find a doctor" },
    { to: "/appointments", label: "My appointments", auth: true },
];

const linkClass = ({ isActive }) =>
    `relative px-1 py-1.5 text-sm font-medium transition ${
        isActive ? "text-brand-700" : "text-ink-700 hover:text-brand-700"
    } ${isActive ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-brand-600" : ""}`;

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const visible = links.filter((l) => !l.auth || user);

    return (
        <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-bone/80 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2.5">
                    <img src="/logo.svg" alt="" className="size-8" />
                    <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
                        Virtual<span className="text-brand-600">MediQueue</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-7 lg:flex">
                    {visible.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                            {l.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    {user ? (
                        <>
                            {user.role !== "doctor" && (
                                <Link to="/register/doctor" className="btn-outline text-sm">
                                    <Stethoscope size={16} />
                                    Become a doctor
                                </Link>
                            )}
                            <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5">
                                <UserCircle2 size={18} className="text-brand-600" />
                                <span className="text-sm font-medium text-ink-800">
                                    {user.username}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="btn-ghost text-sm"
                            >
                                <LogOut size={16} />
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost text-sm">
                                Sign in
                            </Link>
                            <Link to="/signup" className="btn-primary">
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-full border border-ink-200 bg-white p-2 text-ink-700 lg:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </nav>

            {open && (
                <div className="border-t border-ink-100 bg-bone lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
                        {visible.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.end}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-ink-700 hover:bg-ink-100"
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                        <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
                            {user ? (
                                <>
                                    {user.role !== "doctor" && (
                                        <Link
                                            to="/register/doctor"
                                            onClick={() => setOpen(false)}
                                            className="btn-outline text-sm"
                                        >
                                            <Stethoscope size={16} />
                                            Become a doctor
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            handleLogout();
                                        }}
                                        className="btn-ghost text-sm"
                                    >
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setOpen(false)}
                                        className="btn-outline text-sm"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setOpen(false)}
                                        className="btn-primary text-sm"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
