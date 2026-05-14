"use client";



import { useRouter } from "next/navigation";
import useUser from "../../../hooks/useUser";

export default function CategoriesPage() {
    const { user, loading } = useUser() as { user: { role?: string } | null; loading: boolean };
    const router = useRouter();
    // const { user, loading } = useUser();

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
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="mt-2 text-gray-600">Manage category records here.</p>
        </div>
    );
}
