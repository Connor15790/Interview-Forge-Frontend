"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

const FREE_FEATURES = [
    "3 AI course generations per month",
    "5 lessons per course",
    "Quiz per lesson",
    "Quick revision summaries",
    "Enroll in public courses",
    "Track lesson progress",
];

const PRO_FEATURES = [
    "Unlimited course generations",
    "YouTube video per lesson",
    "Custom course thumbnails",
    "Make courses private",
    "Completion certificate via email",
    "Priority support",
];

export default function UpgradePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isPro = session?.user?.plan === "pro";

    const handleUpgrade = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/api/stripe/createCheckout");
            const { url } = res.data;

            if (url) {
                window.location.href = url;
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ?? "Failed to start checkout. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 py-16">

                {/* Header */}
                <div className="mb-12 text-center animate-fade-up">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                        Pricing
                    </p>
                    <h1 className="mb-3 text-4xl font-bold tracking-tight text-primary">
                        Upgrade to Pro
                    </h1>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-secondary">
                        Unlock unlimited AI course generation and everything you need to
                        ace your next technical interview.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid gap-6 animate-fade-up-1 sm:grid-cols-2">

                    {/* Free card */}
                    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
                        <div className="mb-6">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">
                                Free
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-bold tracking-tight text-primary">$0</span>
                                <span className="mb-1 text-sm text-secondary">/month</span>
                            </div>
                            <p className="mt-2 text-sm text-secondary">
                                Perfect for getting started with interview prep.
                            </p>
                        </div>

                        <ul className="mb-8 space-y-3">
                            {FREE_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs text-muted">
                                        ✓
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3 text-center text-sm font-medium text-muted">
                            {isPro ? "Previous plan" : "Current plan"}
                        </div>
                    </div>

                    {/* Pro card */}
                    <div className="relative rounded-2xl border-2 border-accent bg-surface p-8 shadow-accent">

                        {/* Popular badge */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-sm">
                                Most Popular
                            </span>
                        </div>

                        <div className="mb-6">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                                Pro
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-bold tracking-tight text-primary">$5</span>
                                <span className="mb-1 text-sm text-secondary">/month</span>
                            </div>
                            <p className="mt-2 text-sm text-secondary">
                                Everything you need to land your dream job.
                            </p>
                        </div>

                        <ul className="mb-8 space-y-3">
                            {PRO_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                                        ✓
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
                                {error}
                            </div>
                        )}

                        {isPro ? (
                            <div className="rounded-lg bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
                                You are on the Pro plan
                            </div>
                        ) : (
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-white transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? <Spinner /> : null}
                                {loading ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
                            </button>
                        )}

                        <p className="mt-3 text-center text-xs text-muted">
                            Secured by Stripe. Cancel anytime.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16 animate-fade-up-2">
                    <h2 className="mb-6 text-center text-lg font-bold tracking-tight text-primary">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {faqs.map((faq) => (
                            <div
                                key={faq.q}
                                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
                            >
                                <p className="mb-2 text-sm font-semibold text-primary">{faq.q}</p>
                                <p className="text-sm leading-relaxed text-secondary">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

const faqs = [
    {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel anytime from your Stripe billing portal. You'll keep Pro access until the end of your billing period.",
    },
    {
        q: "What payment methods are accepted?",
        a: "All major credit and debit cards are accepted via Stripe. Your payment details are never stored on our servers.",
    },
    {
        q: "What happens to my courses if I downgrade?",
        a: "All your generated courses remain accessible. You just won't be able to generate new ones beyond the free tier limit.",
    },
    {
        q: "Is there a free trial?",
        a: "The free tier gives you 3 course generations per month to try the product. No credit card required.",
    },
];

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}