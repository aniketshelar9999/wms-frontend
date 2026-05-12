"use client";

import { useEffect } from "react";
import useUser from "../../hooks/useUser";
import { useRouter } from "next/navigation";

type User = { name: string };

export default function DashboardPage() {

    const { user, loading } = useUser() as { user: User | null; loading: boolean };

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) return <p>Loading...</p>;

    if (!user) return null;


    return <h1>Welcome {user.name}</h1>;
}
