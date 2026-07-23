export const Spinner = ({ size = 24, label }) => (
    <div className="flex flex-col items-center gap-3 text-ink-500">
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin"
            aria-hidden
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="3"
            />
            <path
                d="M21 12a9 9 0 0 1-9 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
        {label ? <span className="text-xs">{label}</span> : null}
    </div>
);
