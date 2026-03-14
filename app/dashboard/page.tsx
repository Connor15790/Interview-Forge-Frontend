"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const mockCourses = [
  {
    id: "1",
    title: "Mastering System Design Interviews",
    topic: "System Design",
    description:
      "Learn how to design scalable distributed systems. Covers load balancing, caching, databases, and real-world architecture patterns.",
    lessons: 5,
    createdBy: "Rahul Sharma",
    difficulty: "Advanced",
  },
  {
    id: "2",
    title: "Data Structures & Algorithms Crash Course",
    topic: "DSA",
    description:
      "Master the most common DSA patterns asked in FAANG interviews — arrays, trees, graphs, dynamic programming, and more.",
    lessons: 5,
    createdBy: "Priya Mehta",
    difficulty: "Intermediate",
  },
  {
    id: "3",
    title: "React Deep Dive for Frontend Interviews",
    topic: "React",
    description:
      "Covers hooks, reconciliation, performance optimization, and common React interview questions asked at top tech companies.",
    lessons: 5,
    createdBy: "Aman Verma",
    difficulty: "Intermediate",
  },
  {
    id: "4",
    title: "Behavioral Interview Playbook",
    topic: "Behavioral",
    description:
      "Structure compelling answers using STAR method. Covers leadership, conflict resolution, and situational questions.",
    lessons: 5,
    createdBy: "Sneha Iyer",
    difficulty: "Beginner",
  },
  {
    id: "5",
    title: "SQL & Database Design for Interviews",
    topic: "Databases",
    description:
      "Practice joins, indexing, query optimization, and schema design questions commonly asked in backend and data engineering interviews.",
    lessons: 5,
    createdBy: "Karthik Nair",
    difficulty: "Intermediate",
  },
  {
    id: "6",
    title: "Operating Systems Concepts for SWE Interviews",
    topic: "OS",
    description:
      "Deep dive into processes, threads, memory management, deadlocks, and scheduling — critical for systems-level interviews.",
    lessons: 5,
    createdBy: "Divya Reddy",
    difficulty: "Advanced",
  },
];

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

const stats = [
  { value: "6", label: "Public courses" },
  { value: "30", label: "Total lessons" },
  { value: "6", label: "Topics covered" },
  { value: "Free", label: "To get started" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
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
            Each course has 5 structured lessons, quizzes, and quick-revision
            summaries.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 animate-fade-up-1 sm:grid-cols-4">
          {stats.map((s) => (
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

        {/* Course grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className={`group flex flex-col rounded-xl border border-border bg-surface p-5 no-underline shadow-sm transition-all duration-150 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 animate-fade-up-${Math.min(i + 1, 4)}`}
            >
              {/* Badges */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    topicStyles[course.topic] ?? "bg-surface-raised text-muted"
                  }`}
                >
                  {course.topic}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[course.difficulty]}`}
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
                    {course.createdBy.charAt(0)}
                  </div>
                  <span className="text-xs text-muted">{course.createdBy}</span>
                </div>
                <span className="text-xs text-muted">
                  {course.lessons} lessons
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
