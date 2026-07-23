const styles = {
    Pending: "bg-amber-100 text-amber-800",
    CheckedIn: "bg-sky-100 text-sky-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-rose-100 text-rose-800",
};

export const StatusBadge = ({ status }) => (
    <span className={`badge ${styles[status] || "bg-ink-100 text-ink-700"}`}>
        <span
            className={`size-1.5 rounded-full ${
                status === "Pending"
                    ? "bg-amber-500"
                    : status === "CheckedIn"
                      ? "bg-sky-500"
                      : status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
            }`}
        />
        {status}
    </span>
);
