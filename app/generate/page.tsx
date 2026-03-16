"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import { Spinner } from "@/components/Spinner";
import Navbar from "@/components/Navbar";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const TOPIC_SUGGESTIONS = [
  "System Design",
  "Dynamic Programming",
  "React Hooks",
  "SQL Joins",
  "Behavioral Questions",
  "Operating Systems",
  "TypeScript",
  "Graph Algorithms",
];

const difficultyDescriptions: Record<Difficulty, string> = {
  Beginner: "Foundational concepts, clear explanations, introductory questions",
  Intermediate: "Core patterns, practical examples, mid-level interview questions",
  Advanced: "Deep dives, edge cases, senior-level and FAANG-style questions",
};

const topicStyles: Record<string, string> = {
  "System Design": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Dynamic Programming": "bg-purple-50 text-purple-700 border-purple-200",
  "React Hooks": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "SQL Joins": "bg-orange-50 text-orange-700 border-orange-200",
  "Behavioral Questions": "bg-pink-50 text-pink-700 border-pink-200",
  "Operating Systems": "bg-yellow-50 text-yellow-700 border-yellow-200",
  TypeScript: "bg-blue-50 text-blue-700 border-blue-200",
  "Graph Algorithms": "bg-green-50 text-green-700 border-green-200",
};

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [lessonCount, setLessonCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  const isPro = session?.user?.plan === "pro";

  const loadingMessages = [
    "Crafting your lesson structure...",
    "Generating quiz questions...",
    "Writing revision summaries...",
    "Attaching YouTube videos...",
    "Almost done...",
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic before generating.");
      return;
    }

    setError("");
    setLoading(true);
    setLoadingMessage(loadingMessages[0]);

    // Cycle through loading messages while waiting
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[msgIndex]);
    }, 3000);

    try {
      const res = await api.post("/api/generate/generateCourse", {
        topic,
        difficulty,
        lessonCount,
      });

      const courseId = res.data.course._id;
      router.push(`/courses/${courseId}`);
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (err.response?.status === 403) {
        setError(message ?? "You have reached your free tier limit. Upgrade to Pro for unlimited generations.");
      } else {
        setError(message ?? "Failed to generate course. Please try again.");
      }
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
      setLoadingMessage("");
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
            AI Course Generator
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary">
            Generate a Course
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-secondary">
            Enter an interview topic and CourseForge will generate a structured
            micro-course with lessons, quizzes, and revision summaries powered by Gemini.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">

          {/* Form */}
          <div className="lg:col-span-3 animate-fade-up-1">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">

              {/* Free tier banner */}
              {!isPro && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Free tier — 3 generations/month
                    </p>
                    <p className="text-xs text-amber-700">
                      Upgrade for unlimited access and YouTube videos.
                    </p>
                  </div>
                  <a
                    href="/upgrade"
                    className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white no-underline transition-colors hover:bg-amber-600"
                  >
                    Upgrade
                  </a>
                </div>
              )}

              {/* Topic input */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-semibold text-primary">
                  Interview Topic
                  <span className="ml-1 text-error">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. System Design, Dynamic Programming, React..."
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                {/* Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {TOPIC_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTopic(s)}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${topic === s
                        ? topicStyles[s] ?? "bg-accent/10 text-accent border-accent/30"
                        : "border-border bg-surface-raised text-secondary hover:border-accent/30 hover:text-primary"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-semibold text-primary">
                  Difficulty Level
                </label>
                <div className="mb-3 flex rounded-lg border border-border bg-surface-raised p-1">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 cursor-pointer rounded-md border-none py-2 text-sm font-medium transition-all duration-150 ${difficulty === d
                        ? "bg-surface text-primary shadow-sm"
                        : "bg-transparent text-secondary hover:text-primary"
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-secondary">
                  {difficultyDescriptions[difficulty]}
                </p>
              </div>

              {/* Lesson count */}
              <div className="mb-8">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary">
                    Number of Lessons
                  </label>
                  <span className="rounded-lg border border-border bg-surface-raised px-2.5 py-0.5 text-sm font-bold text-primary">
                    {lessonCount}
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={lessonCount}
                  onChange={(e) => setLessonCount(Number(e.target.value))}
                  className="w-full cursor-pointer accent-accent"
                />
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span>3 lessons</span>
                  <span>10 lessons</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  "Generate Course with AI"
                )}
              </button>

              {loading && (
                <p className="mt-3 text-center text-xs text-secondary transition-all duration-300">
                  {loadingMessage}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 animate-fade-up-2">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Live Preview
              </p>

              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                {/* Badges */}
                <div className="mb-4 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${topic
                    ? topicStyles[topic] ?? "bg-accent/10 text-accent"
                    : "bg-surface-raised text-muted"
                    }`}>
                    {topic || "Your Topic"}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${difficulty === "Beginner"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : difficulty === "Intermediate"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-red-200 bg-red-50 text-red-700"
                    }`}>
                    {difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-sm font-bold text-primary">
                  {topic
                    ? `${difficulty}-level ${topic} Interview Prep`
                    : "Your course title will appear here"}
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-secondary">
                  {topic
                    ? `A structured ${lessonCount}-lesson micro-course covering ${topic} concepts, patterns, and interview questions.`
                    : "Enter a topic above to see a preview of your course."}
                </p>

                {/* Lesson skeletons */}
                <div className="space-y-2">
                  {Array.from({ length: lessonCount }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-raised px-3 py-2"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className={`h-2 rounded-full bg-border ${i === 0 ? "w-3/4" : i === 1 ? "w-2/3" : i === 2 ? "w-4/5" : "w-1/2"
                          }`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* What's included */}
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold text-muted">Each lesson includes</p>
                  <ul className="space-y-1.5">
                    {[
                      "Detailed lesson content",
                      "Quiz questions",
                      "Quick revision summary",
                      isPro ? "YouTube video" : null,
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <li key={item as string} className="flex items-center gap-2 text-xs text-secondary">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Pro upsell */}
              {!isPro && (
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <p className="mb-1 text-sm font-semibold text-primary">Unlock Pro</p>
                  <p className="mb-3 text-xs leading-relaxed text-secondary">
                    Unlimited generations, YouTube videos, custom thumbnails, private courses, and completion certificates.
                  </p>
                  <a
                    href="/upgrade"
                    className="block rounded-lg bg-accent px-4 py-2 text-center text-xs font-semibold text-white no-underline transition-colors hover:bg-accent-hover"
                  >
                    Upgrade to Pro
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}