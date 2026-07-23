export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
        {Icon ? (
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={22} />
            </div>
        ) : null}
        <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
        {description ? (
            <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
        ) : null}
        {action ? <div className="mt-5">{action}</div> : null}
    </div>
);
