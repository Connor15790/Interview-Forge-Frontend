"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      {/* Subtle grid background */}
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
      <div className="animate-fade-up relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-indigo-400 via-accent to-indigo-600" />

        <div className="p-8">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2.5">
            <span className="inline-block h-7 w-7 rounded-lg bg-accent shadow-accent" />
            <span className="text-base font-bold tracking-tight text-primary">
              CourseForge
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-primary">
              Welcome back
            </h1>
            <p className="text-sm leading-relaxed text-secondary">
              Sign in to generate AI-powered interview prep courses and track
              your progress.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-primary shadow-sm transition-all duration-150 hover:bg-surface-raised hover:shadow-md"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted">
              What you get
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-sm text-secondary"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent font-semibold">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-8 py-4 bg-surface-raised">
          <p className="text-center text-xs text-muted">
            By signing in you agree to our{" "}
            <a
              href="#"
              className="text-secondary underline-offset-2 hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-secondary underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const features = [
  "Generate AI micro-courses on any interview topic",
  "5 structured lessons with quizzes per course",
  "Quick-revision summaries for every lesson",
  "Track your progress across all enrolled courses",
];

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
