import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarPlus, Eye, Stethoscope, X } from "lucide-react";

import { api, errorMessage } from "../api/client.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";

export default function MyAppointments() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data } = await api.get("/appointments/me");
            setList(data.data?.appointments ?? []);
        } catch (err) {
            toast.error(errorMessage(err, "Could not load appointments"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const cancel = async (id) => {
        if (!window.confirm("Cancel this appointment?")) return;
        try {
            await api.patch(`/appointments/${id}/status`, { status: "Cancelled" });
            toast.success("Appointment cancelled");
            load();
        } catch (err) {
            toast.error(errorMessage(err, "Could not cancel"));
        }
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Your visits
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    My appointments
                </h1>
                <p className="mt-3 text-ink-600">
                    Track upcoming and past appointments. Cancel any pending visit anytime.
                </p>
            </header>

            {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                    <Spinner label="Loading appointments…" />
                </div>
            ) : list.length === 0 ? (
                <EmptyState
                    icon={Stethoscope}
                    title="No appointments yet"
                    description="Book your first visit to see it here."
                    action={
                        <Link to="/doctors" className="btn-primary">
                            <CalendarPlus size={16} />
                            Book an appointment
                        </Link>
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
                    <table className="min-w-full divide-y divide-ink-100 text-left text-sm">
                        <thead className="bg-bone/60 text-xs uppercase tracking-wider text-ink-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Doctor</th>
                                <th className="px-4 py-3 font-medium">Patient</th>
                                <th className="px-4 py-3 font-medium">Booked</th>
                                <th className="px-4 py-3 font-medium">Queue #</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-100">
                            {list.map((a) => (
                                <tr key={a._id} className="hover:bg-bone/40">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-ink-900">
                                            Dr. {a.doctor?.fullname || "Unknown"}
                                        </div>
                                        <div className="text-xs text-ink-500">
                                            {a.doctor?.specializations}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-ink-700">{a.patientName}</td>
                                    <td className="px-4 py-3 text-ink-600">
                                        {new Date(a.createdAt).toLocaleString(undefined, {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 font-mono font-semibold text-brand-700">
                                        #{a.queueNumber}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={a.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            {a.doctorId && (
                                                <Link
                                                    to={`/doctors/${a.doctorId}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-700 hover:border-brand-400 hover:text-brand-700"
                                                >
                                                    <Eye size={12} />
                                                    View
                                                </Link>
                                            )}
                                            {(a.status === "Pending" ||
                                                a.status === "CheckedIn") && (
                                                <button
                                                    type="button"
                                                    onClick={() => cancel(a._id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-700 hover:border-rose-300 hover:text-rose-600"
                                                >
                                                    <X size={12} />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
