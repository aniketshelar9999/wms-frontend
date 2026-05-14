"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import useLogout from "../../hooks/useLogout";
import Link from "next/link";
import ConfirmModal from "@/src/components/ConfirmModal";



interface User {
    id: string;
    name: string;
    role: string;
}

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const logout = useLogout();
    const [open, setOpen] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const router = useRouter();

    const { user, loading } = useUser() as { user: User | null; loading: boolean };

    if (loading) return <div className="p-6">Loading...</div>;

    if (!user) {
        router.replace("/login");
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">

            {/* Sidebar */}
            <aside className={`${open ? "w-64" : "w-20"} bg-white border-r`}>
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {open ? "WMS" : "WM"}
                    </h1>

                    <button onClick={() => setOpen(!open)}>
                        {open ? "◀" : "▶"}
                    </button>
                </div>

                <nav className="mt-6 space-y-2 px-4">
                    <Link href="/dashboard" className="block p-3 rounded-lg hover:bg-gray-100">Dashboard</Link >

                    {/* Manager-only */}
                    {user.role === "manager" && (
                        <>
                            <Link href="/dashboard/brands" className="block p-3 rounded-lg hover:bg-gray-100">Brands</Link >
                            <Link href="/dashboard/suppliers" className="block p-3 rounded-lg hover:bg-gray-100">Suppliers</Link >
                            <Link href="/dashboard/categories" className="block p-3 rounded-lg hover:bg-gray-100">Categories</Link >
                            <Link href="/dashboard/products" className="block p-3 rounded-lg hover:bg-gray-100">Products</Link >
                            <Link href="/dashboard/users" className="block p-3 rounded-lg hover:bg-gray-100">Users</Link >
                        </>
                    )}

                    {/* User-only */}
                    {user.role === "employee" && (
                        <>
                            <Link href="/dashboard/my-tasks" className="block p-3 rounded-lg hover:bg-gray-100">My Tasks</Link >
                            <Link href="/dashboard/my-shifts" className="block p-3 rounded-lg hover:bg-gray-100">My Shifts</Link >
                        </>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {user.role === "manager" ? "Manager Dashboard" : "User Dashboard"}
                    </h2>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Hello, {user.name}</span>
                        <button
                            onClick={() => setConfirmOpen(true)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <ConfirmModal
                    open={confirmOpen}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        setConfirmOpen(false);
                        logout(user.id);
                    }}
                />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
