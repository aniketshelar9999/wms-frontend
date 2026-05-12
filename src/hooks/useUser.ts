import { useEffect, useRef, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const called = useRef(false);

    const getAccessToken = () => localStorage.getItem("accessToken");

    const fetchUser = async () => {
        try {
            setLoading(true);

            const token = getAccessToken();

            const res = await fetch("http://localhost:3000/users/me", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                credentials: "include",
            });

            // If access token expired → try refresh
            if (res.status === 401) {
                const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                if (!refreshRes.ok) {
                    setUser(null);
                    return;
                }

                // Get new access token from refresh response
                const refreshData = await refreshRes.json();
                localStorage.setItem("accessToken", refreshData.accessToken);

                // Retry with NEW token
                const retryRes = await fetch("http://localhost:3000/users/me", {
                    headers: { Authorization: `Bearer ${refreshData.accessToken}` },
                    credentials: "include",
                });

                if (retryRes.ok) {
                    const data = await retryRes.json();
                    setUser(data);
                } else {
                    setUser(null);
                }

                return;
            }

            // SUCCESS CASE
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        // Small delay so cookies attach
        setTimeout(() => {
            fetchUser();
        }, 50);
    }, []);

    return { user, loading };
}
