import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Search, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

import { api, errorMessage } from "../api/client.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";

export default function AllDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [spec, setSpec] = useState("All");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get("/doctors");
                if (!cancelled) setDoctors(data.data?.doctors ?? []);
            } catch (err) {
                toast.error(errorMessage(err, "Could not load doctors"));
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const specs = useMemo(() => {
        const set = new Set(doctors.map((d) => d.specializations).filter(Boolean));
        return ["All", ...Array.from(set).sort()];
    }, [doctors]);

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase();
        return doctors.filter((d) => {
            if (spec !== "All" && d.specializations !== spec) return false;
            if (!ql) return true;
            return (
                d.fullname?.toLowerCase().includes(ql) ||
                d.hospitalname?.toLowerCase().includes(ql) ||
                d.specializations?.toLowerCase().includes(ql)
            );
        });
    }, [doctors, q, spec]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Directory
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    Find the right doctor for you.
                </h1>
                <p className="mt-3 text-ink-600">
                    Browse verified clinicians by specialty, hospital, or name. Tap any card
                    to book and join the queue.
                </p>
            </header>

            <div className="sticky top-[72px] z-10 mb-8 flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white/90 p-3 shadow-soft backdrop-blur sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute inset-y-0 left-3 my-auto text-ink-400"
                    />
                    <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by doctor, hospital, or specialty…"
                        className="field-input pl-9"
                    />
                </div>
                <select
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    className="field-input sm:w-56"
                >
                    {specs.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex min-h-[320px] items-center justify-center">
                    <Spinner label="Loading doctors…" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={Stethoscope}
                    title="No doctors match your filters"
                    description="Try clearing the specialty or searching with fewer words."
                />
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((d) => (
                        <li key={d._id}>
                            <Link
                                to={`/doctors/${d._id}`}
                                className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="grid size-12 place-items-center rounded-2xl bg-brand-50 font-display text-lg font-semibold text-brand-700">
                                        {initials(d.fullname)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-display text-lg font-semibold text-ink-900">
                                            Dr. {d.fullname}
                                        </p>
                                        <p className="text-sm text-brand-700">
                                            {d.specializations}
                                        </p>
                                    </div>
                                </div>
                                <dl className="mt-4 space-y-2 text-sm text-ink-600">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-ink-400" />
                                        <dd className="truncate">{d.hospitalname}</dd>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-ink-400" />
                                        <dd className="truncate">{d.address}</dd>
                                    </div>
                                </dl>
                                <span className="mt-5 self-start text-sm font-medium text-brand-700 transition group-hover:text-brand-800">
                                    View &amp; book →
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
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
