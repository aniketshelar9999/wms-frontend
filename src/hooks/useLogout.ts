import useUser from "./useUser";

export default function useLogout() {
    const { user } = useUser() as { user: { id: string } | null };

    const logout = async (id: any) => {
        if (!user) return;

        try {
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }), // ⭐ send userId
            });

            // Remove access token
            localStorage.removeItem("accessToken");

            // Redirect
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return logout;
}
