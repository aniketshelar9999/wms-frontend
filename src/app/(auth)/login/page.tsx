"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }



    const validate = () => {
        const newErrors: any = {};
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setMessage("");
        try {
            setLoading(true);
            setMessage("");
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });
            let data: any = {};
            try {
                data = await res.json();
            } catch {
                data = { message: "Invalid server response" };
            }
            if (!res.ok) {
                setMessage(data.message || "Login failed");
                setLoading(false);
                return;
            }
            router.push("/dashboard");
            return;

        } catch (error) {
            setMessage("An error occurred while logging in.");
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    return (

        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <div className="w-full max-w-md bg-white rounded-2xl p-10 border border-[#E5E5E7]">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
                    Login
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="space-y-1">
                        <input
                            name="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-xl border border-[#D1D1D6] bg-[#FAFAFA]
              focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none
              transition-all"
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 rounded-xl border border-[#D1D1D6] bg-[#FAFAFA]
              focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none
              transition-all"
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl 
    font-medium transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {mounted && loading ? "Logging in..." : "Login"}
                    </button>

                    {/* ⭐ Loader (Option 2) */}
                    {mounted && loading && (
                        <div className="flex justify-center mt-4">
                            <div className="h-6 w-6 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </form>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
                )}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link href="/register" className="text-green-600 font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>

        </div>



    )
}