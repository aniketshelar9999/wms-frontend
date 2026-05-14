"use client";


import { useRouter } from "next/navigation";
import useUser from "../../../hooks/useUser";

export default function ProductsPage() {
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
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="mt-2 text-gray-600">Manage product records here.</p>
        </div>
    );
}
