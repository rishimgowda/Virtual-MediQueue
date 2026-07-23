import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 15_000,
});

let isRefreshing = false;
let pending = [];

const flush = (err) => {
    pending.forEach((cb) => cb(err));
    pending = [];
};

api.interceptors.response.use(
    (r) => r,
    async (error) => {
        const original = error.config;
        if (!original) return Promise.reject(error);

        const isAuthCall = original.url?.startsWith("/auth/");
        if (error.response?.status === 401 && !original._retry && !isAuthCall) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pending.push((err) => (err ? reject(err) : resolve(api(original))));
                });
            }

            isRefreshing = true;
            try {
                await api.post("/auth/refresh");
                isRefreshing = false;
                flush(null);
                return api(original);
            } catch (refreshErr) {
                isRefreshing = false;
                flush(refreshErr);
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);

export const errorMessage = (err, fallback = "Something went wrong") => {
    return (
        err?.response?.data?.message ||
        err?.response?.data?.details?.[0]?.message ||
        err?.message ||
        fallback
    );
};
