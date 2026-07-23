import { Link } from "react-router-dom";
import { Github, Heart } from "lucide-react";

export const Footer = () => (
    <footer className="border-t border-ink-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
                <div>
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/logo.svg" alt="" className="size-8" />
                        <span className="font-display text-lg font-semibold text-ink-900">
                            Virtual<span className="text-brand-600">MediQueue</span>
                        </span>
                    </Link>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
                        A virtual queue management system that gives back the time
                        patients used to lose in waiting rooms.
                    </p>
                </div>
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                        Product
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-ink-700">
                        <li>
                            <Link to="/doctors" className="hover:text-brand-700">
                                Find a doctor
                            </Link>
                        </li>
                        <li>
                            <Link to="/register/doctor" className="hover:text-brand-700">
                                Doctor onboarding
                            </Link>
                        </li>
                        <li>
                            <Link to="/appointments" className="hover:text-brand-700">
                                My appointments
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                        Open source
                    </h4>
                    <p className="mt-3 max-w-xs text-sm text-ink-700">
                        Built with the MERN stack. Contributions welcome.
                    </p>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
                    >
                        <Github size={16} />
                        View on GitHub
                    </a>
                </div>
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-500 sm:flex-row">
                <span>© {new Date().getFullYear()} Virtual MediQueue. All rights reserved.</span>
                <span className="inline-flex items-center gap-1.5">
                    Built with <Heart size={12} className="text-brand-500" /> for healthier waits.
                </span>
            </div>
        </div>
    </footer>
);
