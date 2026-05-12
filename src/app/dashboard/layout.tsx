"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import useLogout from "../../hooks/useLogout";

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
                    <a className="block p-3 rounded-lg hover:bg-gray-100">Dashboard</a>
                    <a className="block p-3 rounded-lg hover:bg-gray-100">Inventory</a>

                    {/* Manager-only */}
                    {user.role === "manager" && (
                        <>
                            <a className="block p-3 rounded-lg hover:bg-gray-100">Suppliers</a>
                            <a className="block p-3 rounded-lg hover:bg-gray-100">Brands</a>
                            <a className="block p-3 rounded-lg hover:bg-gray-100">Users</a>
                        </>
                    )}

                    {/* User-only */}
                    {user.role === "employee" && (
                        <>
                            <a className="block p-3 rounded-lg hover:bg-gray-100">My Tasks</a>
                            <a className="block p-3 rounded-lg hover:bg-gray-100">My Shifts</a>
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
                        <button onClick={() => logout(user.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
