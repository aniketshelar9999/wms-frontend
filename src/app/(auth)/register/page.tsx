"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",

    });

    const [errors, setErrors] = useState<any>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const validate = () => {
        const newErrors: any = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password.trim()) newErrors.password = "Password is required";
        if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            setMessage("Registration successful! Redirecting...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (error) {
            setMessage("Something went wrong. Try again.");
        }

        setLoading(false);

    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <div className="w-full max-w-md bg-white rounded-2xl p-10 border border-[#E5E5E7]">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
                    Register
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <input
                            name="name"
                            placeholder="Name"
                            className="w-full p-3 rounded-xl border border-[#D1D1D6] bg-[#FAFAFA]
                     focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none
                     transition-all"
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>

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
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>

    );

}