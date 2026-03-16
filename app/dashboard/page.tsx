"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import api from "@/lib/axios";

interface Course {
  _id: string;
  title: string;
  topic: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: { _id: string }[];
  createdBy: {
    _id: string;
    name: string;
    image?: string;
  };
  isPublic: boolean;
  thumbnail?: string;
  createdAt: string;
}

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-green-50 text-green-700 border border-green-200",
  Intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced: "bg-red-50 text-red-700 border border-red-200",
};

const topicStyles: Record<string, string> = {
  "System Design": "bg-indigo-50 text-indigo-700",
  DSA: "bg-purple-50 text-purple-700",
  React: "bg-cyan-50 text-cyan-700",
  Behavioral: "bg-pink-50 text-pink-700",
  Databases: "bg-orange-50 text-orange-700",
  OS: "bg-yellow-50 text-yellow-700",
};

const DashboardPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();

  // Handle Stripe redirect back with session_id
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    async function verifyPayment() {
      setVerifyingPayment(true);
      try {
        await api.post("/api/stripe/verifyPayment", { sessionId });
        // Refresh NextAuth session so plan updates everywhere
        await updateSession();
        setUpgradeSuccess(true);
        // Clean up the URL without triggering a reload
        window.history.replaceState({}, "", "/dashboard");
        // Force NextAuth to refetch the session from the server
        await updateSession({ force: true });
        setUpgradeSuccess(true);
      } catch (err: any) {
        console.error("Payment verification failed:", err);
      } finally {
        setVerifyingPayment(false);
      }
    }

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/api/course/fetchAllCourses");
        setCourses(res.data);
      } catch {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Payment verifying banner */}
        {verifyingPayment && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-sm text-accent">
            <svg className="h-4 w-4 animate-spin shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Verifying your payment...
          </div>
        )}

        {/* Upgrade success banner */}
        {upgradeSuccess && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-sm text-success">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Welcome to Pro!
                </p>
                <p className="text-xs text-green-700">
                  You now have unlimited course generations and all Pro features.
                </p>
              </div>
            </div>
            <button
              onClick={() => setUpgradeSuccess(false)}
              className="cursor-pointer border-none bg-transparent text-xs text-green-600 hover:text-green-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                Interview Prep
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Explore Courses
              </h1>
            </div>
            <Link
              href="/generate"
              className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors duration-150 hover:bg-accent-hover"
            >
              + Generate Course
            </Link>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-secondary">
            Browse AI-generated micro-courses built for interview preparation.
            Each course has structured lessons, quizzes, and quick-revision summaries.
          </p>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-10 grid grid-cols-2 gap-4 animate-fade-up-1 sm:grid-cols-4">
            {[
              { value: courses.length.toString(), label: "Public courses" },
              { value: courses.reduce((acc, c) => acc + c.lessons.length, 0).toString(), label: "Total lessons" },
              { value: [...new Set(courses.map((c) => c.topic))].length.toString(), label: "Topics covered" },
              { value: "Free", label: "To get started" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                <p className="text-2xl font-bold tracking-tight text-primary">
                  {s.value}
                </p>
                <p className="mt-0.5 text-xs text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="mb-3 flex gap-2">
                  <div className="h-5 w-20 animate-pulse rounded-full bg-surface-raised" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-surface-raised" />
                </div>
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-surface-raised" />
                <div className="mb-1 h-3 w-full animate-pulse rounded bg-surface-raised" />
                <div className="mb-1 h-3 w-full animate-pulse rounded bg-surface-raised" />
                <div className="mb-4 h-3 w-2/3 animate-pulse rounded bg-surface-raised" />
                <div className="flex justify-between border-t border-border pt-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-surface-raised" />
                  <div className="h-3 w-16 animate-pulse rounded bg-surface-raised" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-error">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl">
              📚
            </div>
            <h2 className="mb-2 text-base font-semibold text-primary">
              No courses yet
            </h2>
            <p className="mb-6 max-w-sm text-sm text-secondary">
              Be the first to generate an AI interview prep course.
            </p>
            <Link
              href="/generate"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-accent-hover"
            >
              Generate First Course
            </Link>
          </div>
        )}

        {/* Course grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className={`group flex flex-col rounded-xl border border-border bg-surface p-5 no-underline shadow-sm transition-all duration-150 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 animate-fade-up-${Math.min(i + 1, 4)}`}
              >
                {/* Badges */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${topicStyles[course.topic] ?? "bg-surface-raised text-muted"
                      }`}
                  >
                    {course.topic}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[course.difficulty]
                      }`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-sm font-semibold leading-snug tracking-tight text-primary transition-colors group-hover:text-accent">
                  {course.title}
                </h2>

                {/* Description */}
                <p className="mb-4 flex-1 text-xs leading-relaxed text-secondary line-clamp-3">
                  {course.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      {course.createdBy?.name?.charAt(0) ?? "?"}
                    </div>
                    <span className="text-xs text-muted">
                      {course.createdBy?.name ?? "Unknown"}
                    </span>
                  </div>
                  <span className="text-xs text-muted">
                    {course.lessons.length} lessons
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;