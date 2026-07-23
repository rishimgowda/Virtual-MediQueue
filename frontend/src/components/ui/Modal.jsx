import { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ open, onClose, title, children, footer }) => {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg animate-fade-up overflow-hidden rounded-2xl bg-white shadow-card">
                <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
                    <h3 className="font-display text-lg font-semibold text-ink-900">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </header>
                <div className="px-6 py-5">{children}</div>
                {footer ? (
                    <footer className="flex items-center justify-end gap-3 border-t border-ink-100 bg-ink-50/50 px-6 py-4">
                        {footer}
                    </footer>
                ) : null}
            </div>
        </div>
    );
};
