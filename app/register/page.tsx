"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/Spinner";

const RegisterPage = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (form.password.length < 5) {
            setError("Password must be at least 5 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signUpUser`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        password: form.password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? "Registration failed. Please try again.");
                return;
            }

            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                callbackUrl: "/dashboard",
                redirect: true,
            });

            if (result?.error) {
                setError("Account created but sign in failed. Please log in manually.");
                router.push("/login");
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
            {/* Background grid */}
            <div
                className="pointer-events-none fixed inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(#e4e7ec 1px, transparent 1px), linear-gradient(90deg, #e4e7ec 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Accent glow */}
            <div className="pointer-events-none fixed left-1/2 top-1/3 h-96 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

            {/* Card */}
            <div className="animate-fade-up relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">

                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-indigo-400 via-accent to-indigo-600" />

                <div className="p-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2.5 no-underline"
                    >
                        <span className="inline-block h-6 w-6 rounded-lg bg-accent" />
                        <span className="text-sm font-bold tracking-tight text-primary">
                            CourseForge
                        </span>
                    </Link>

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="mb-1.5 text-2xl font-bold tracking-tight text-primary">
                            Create an account
                        </h1>
                        <p className="text-sm text-secondary">
                            Start generating AI interview prep courses for free.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-secondary">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                autoComplete="name"
                                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-secondary">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                autoComplete="email"
                                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-secondary">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 5 characters"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 pr-10 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent text-xs text-muted hover:text-secondary"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-secondary">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 pr-10 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent text-xs text-muted hover:text-secondary"
                                >
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? <Spinner /> : null}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted">or</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all hover:bg-surface-raised hover:shadow-md"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>
                </div>

                {/* Footer */}
                <div className="border-t border-border bg-surface-raised px-8 py-4 text-center">
                    <p className="text-xs text-secondary">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-accent no-underline hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default RegisterPage;