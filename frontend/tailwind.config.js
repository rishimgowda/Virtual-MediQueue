/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
                sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
            },
            colors: {
                // Calm medical teal as the brand color
                brand: {
                    50: "#f0fbfa",
                    100: "#cdf3f0",
                    200: "#9be8e2",
                    300: "#62d6cf",
                    400: "#34bdb6",
                    500: "#1ba39d",
                    600: "#15827e",
                    700: "#136866",
                    800: "#125352",
                    900: "#0f4544",
                    950: "#062827",
                },
                ink: {
                    50: "#f7f7f6",
                    100: "#e6e6e3",
                    200: "#cccdc6",
                    300: "#a8aaa1",
                    400: "#83867a",
                    500: "#676b60",
                    600: "#52564b",
                    700: "#43473e",
                    800: "#393b34",
                    900: "#2c2e29",
                    950: "#1a1c18",
                },
                bone: "#fbf9f4", // warm off-white background
            },
            boxShadow: {
                soft: "0 1px 2px rgba(20,40,40,0.04), 0 8px 24px -12px rgba(20,40,40,0.10)",
                card: "0 1px 0 rgba(20,40,40,0.04), 0 12px 32px -16px rgba(20,40,40,0.18)",
            },
            borderRadius: {
                xl2: "1.25rem",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseRing: {
                    "0%": { transform: "scale(0.8)", opacity: "0.8" },
                    "100%": { transform: "scale(2)", opacity: "0" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s ease-out both",
                "pulse-ring": "pulseRing 1.6s cubic-bezier(0.215,0.61,0.355,1) infinite",
            },
        },
    },
    plugins: [],
};
