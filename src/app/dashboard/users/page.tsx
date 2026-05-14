"use client";

import useUser from "../../../hooks/useUser";
import { useRouter } from "next/navigation";

export default function UsersPage() {
    const { user, loading } = useUser() as { user: { role?: string } | null; loading: boolean };
    const router = useRouter();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        router.replace("/login");
        return null;
    }

    if (user.role !== "manager") {
        return <div className="text-red-600 text-xl">Access Denied — Managers Only</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="mt-2 text-gray-600">Manage user records here.</p>
        </div>
    );
}
