import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
    return (
        <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Compass size={28} />
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-500">
                Error 404
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                That page is off the map.
            </h1>
            <p className="mt-3 max-w-md text-ink-600">
                The link you followed may be broken, or the page may have moved. Let's get
                you back to a known route.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/" className="btn-primary">
                    Back to home
                </Link>
                <Link to="/doctors" className="btn-outline">
                    Browse doctors
                </Link>
            </div>
        </section>
    );
}
