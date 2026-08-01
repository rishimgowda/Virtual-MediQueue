import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, errorMessage } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.data?.user ?? null);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await refreshUser();
            setLoading(false);
        })();
    }, [refreshUser]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setUser(data.data?.user ?? null);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: errorMessage(err, "Login failed") };
        }
    };

    const register = async (payload) => {
        try {
            const { data } = await api.post("/auth/register", payload);
            setUser(data.data?.user ?? null);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: errorMessage(err, "Registration failed") };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            /* ignore */
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, refreshUser, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};


/*Creating a global authentication context.
Storing the currently logged-in user's information.
Checking whether a user is already logged in when the app starts.
Providing login, registration, and logout functionality.
Sharing authentication data and functions with every component in the application through React Context.
Providing a simple useAuth() hook so components can easily access authentication features*/
