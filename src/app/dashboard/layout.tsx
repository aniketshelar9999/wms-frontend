"use client";

import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">

            {/* Sidebar */}
            <aside
                className={`${open ? "w-64" : "w-20"
                    } bg-white border-r border-gray-200 transition-all duration-300`}
            >
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {open ? "WMS Manager" : "WM"}
                    </h1>

                    <button
                        onClick={() => setOpen(!open)}
                        className="text-gray-600 hover:text-black"
                    >
                        {open ? "◀" : "▶"}
                    </button>
                </div>

                <nav className="mt-6 space-y-2 px-4">
                    <a className="block p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Dashboard
                    </a>
                    <a className="block p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Inventory
                    </a>
                    <a className="block p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Suppliers
                    </a>
                    <a className="block p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Brands
                    </a>
                    <a className="block p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Users
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Manager Dashboard</h2>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Hello, Manager</span>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
