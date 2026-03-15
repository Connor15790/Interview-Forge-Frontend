"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

interface Quiz {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Lesson {
  _id: string;
  order: number;
  title: string;
  content: string;
  summary: string;
  videoUrl?: string;
  quiz: Quiz[];
}

interface Course {
  _id: string;
  title: string;
  topic: string;
  description: string;
  difficulty: string;
  lessons: Lesson[];
  createdBy: { _id: string; name: string; image?: string };
  isPublic: boolean;
  thumbnail?: string;
}

interface Enrollment {
  _id: string;
  progress: string[];
  completedAt?: string;
}

type QuizState = Record<string, { selected: string; submitted: boolean }>;

const topicStyles: Record<string, string> = {
  "System Design": "bg-indigo-50 text-indigo-700",
  DSA: "bg-purple-50 text-purple-700",
  React: "bg-cyan-50 text-cyan-700",
  Behavioral: "bg-pink-50 text-pink-700",
  Databases: "bg-orange-50 text-orange-700",
  OS: "bg-yellow-50 text-yellow-700",
};

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-green-50 text-green-700 border border-green-200",
  Intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced: "bg-red-50 text-red-700 border border-red-200",
};

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizState, setQuizState] = useState<QuizState>({});
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  // Fetch course and enrollment on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const courseRes = await api.get(`/api/course/fetchCourseById/${id}`);
        const courseData: Course = courseRes.data;
        setCourse(courseData);
        setActiveLessonId(courseData.lessons[0]._id);

        // Check enrollment
        try {
          const enrollRes = await api.get(`/api/enrollment/${id}`);
          const enrollData: Enrollment = enrollRes.data;
          setEnrollment(enrollData);
          setCompletedLessons(new Set(enrollData.progress));
        } catch {
          // 404 means not enrolled yet — that's fine
        }
      } catch {
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const res = await api.post(`/api/enrollment/${id}`);
      setEnrollment(res.data.enrollment);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      }
    } finally {
      setEnrolling(false);
    }
  }

  const handleMarkComplete = async (lessonId: string) => {
    if (!enrollment) return;
    setCompleting(true);
    try {
      const res = await api.post(`/api/enrollment/${id}/lesson/${lessonId}/complete`);
      setCompletedLessons(new Set(res.data.progress));

      // Move to next lesson if available
      const idx = course!.lessons.findIndex((l) => l._id === lessonId);
      if (idx < course!.lessons.length - 1) {
        setActiveLessonId(course!.lessons[idx + 1]._id);
      }
    } catch {
      setError("Failed to mark lesson complete. Please try again.");
    } finally {
      setCompleting(false);
    }
  }

  const handleOptionSelect = (quizId: string, option: string) => {
    if (quizState[quizId]?.submitted) return;
    setQuizState((prev) => ({
      ...prev,
      [quizId]: { selected: option, submitted: false },
    }));
  }

  const handleSubmitQuiz = (quizId: string) => {
    if (!quizState[quizId]?.selected) return;
    setQuizState((prev) => ({
      ...prev,
      [quizId]: { ...prev[quizId], submitted: true },
    }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 h-6 w-32 animate-pulse rounded bg-surface-raised" />
          <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-surface-raised" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-raised" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-error">
            {error || "Course not found."}
          </div>
        </div>
      </div>
    );
  }

  const activeLesson = course.lessons.find((l) => l._id === activeLessonId) ?? course.lessons[0];
  const progress = Math.round((completedLessons.size / course.lessons.length) * 100);
  const allQuizzesAnswered = activeLesson.quiz.every((q) => quizState[q._id]?.submitted);
  const isLessonComplete = completedLessons.has(activeLesson._id);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Progress bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary no-underline transition-colors hover:text-primary"
        >
          ← Back to Dashboard
        </Link>

        {/* Course header */}
        <div className="mb-8 animate-fade-up">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${topicStyles[course.topic] ?? "bg-surface-raised text-muted"}`}>
              {course.topic}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[course.difficulty]}`}>
              {course.difficulty}
            </span>
            {completedLessons.size === course.lessons.length && enrollment && (
              <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                Completed
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-primary">
                {course.title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-secondary">
                {course.description}
              </p>
            </div>
            {!enrollment ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : "Enroll Free"}
              </button>
            ) : (
              <div className="shrink-0 text-right">
                <p className="text-xs text-secondary">Progress</p>
                <p className="text-lg font-bold text-primary">
                  {completedLessons.size}/{course.lessons.length} lessons
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6 animate-fade-up-1">

          {/* Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-surface p-3 shadow-sm">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted">
                Lessons
              </p>
              <ul className="space-y-1">
                {course.lessons.map((lesson) => {
                  const isActive = lesson._id === activeLessonId;
                  const isDone = completedLessons.has(lesson._id);
                  return (
                    <li key={lesson._id}>
                      <button
                        onClick={() => setActiveLessonId(lesson._id)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-none px-3 py-2.5 text-left text-sm transition-colors duration-150 ${isActive
                          ? "bg-accent/10 font-semibold text-accent"
                          : "bg-transparent text-secondary hover:bg-surface-raised hover:text-primary"
                          }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isDone
                          ? "bg-success text-white"
                          : isActive
                            ? "bg-accent text-white"
                            : "bg-surface-raised text-muted"
                          }`}>
                          {isDone ? "✓" : lesson.order}
                        </span>
                        <span className="line-clamp-2 leading-snug">{lesson.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">

            {/* Lesson header */}
            <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Lesson {activeLesson.order}
                </span>
                {isLessonComplete && (
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                )}
              </div>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-primary">
                {activeLesson.title}
              </h2>
              <div>
                {activeLesson.content.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 text-sm leading-relaxed text-secondary last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* YouTube video — Pro */}
            {activeLesson.videoUrl && (
              <div className="mb-6 overflow-hidden rounded-xl border border-border shadow-sm">
                <iframe
                  src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                  title={activeLesson.title}
                  className="aspect-video w-full"
                  allowFullScreen
                />
              </div>
            )}

            {/* Summary */}
            <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                Quick Revision Summary
              </p>
              <p className="text-sm leading-relaxed text-secondary">
                {activeLesson.summary}
              </p>
            </div>

            {/* Quiz */}
            {activeLesson.quiz.length > 0 && (
              <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
                  Knowledge Check
                </p>
                <div className="space-y-6">
                  {activeLesson.quiz.map((q) => {
                    const state = quizState[q._id];
                    const submitted = state?.submitted ?? false;

                    return (
                      <div key={q._id}>
                        <p className="mb-3 text-sm font-semibold text-primary">
                          {q.question}
                        </p>
                        <ul className="space-y-2">
                          {q.options.map((option) => {
                            const isSelected = state?.selected === option;
                            const isCorrect = option === q.correctAnswer;

                            let optionStyle = "border-border bg-surface text-secondary hover:border-accent/40 hover:bg-accent/5";
                            if (submitted) {
                              if (isCorrect) optionStyle = "border-green-300 bg-green-50 text-green-800 font-medium";
                              else if (isSelected) optionStyle = "border-red-300 bg-red-50 text-red-800";
                              else optionStyle = "border-border bg-surface text-muted";
                            } else if (isSelected) {
                              optionStyle = "border-accent bg-accent/10 text-accent font-medium";
                            }

                            return (
                              <li key={option}>
                                <button
                                  onClick={() => handleOptionSelect(q._id, option)}
                                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150 ${optionStyle}`}
                                >
                                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs ${isSelected && !submitted ? "border-accent bg-accent text-white"
                                    : submitted && isCorrect ? "border-green-500 bg-green-500 text-white"
                                      : submitted && isSelected ? "border-red-500 bg-red-500 text-white"
                                        : "border-border"
                                    }`}>
                                    {submitted && isCorrect ? "✓" : submitted && isSelected ? "✗" : ""}
                                  </span>
                                  {option}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        {!submitted && (
                          <button
                            onClick={() => handleSubmitQuiz(q._id)}
                            disabled={!state?.selected}
                            className="mt-3 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Check Answer
                          </button>
                        )}
                        {submitted && (
                          <p className={`mt-2 text-xs font-medium ${state.selected === q.correctAnswer ? "text-success" : "text-error"}`}>
                            {state.selected === q.correctAnswer
                              ? "Correct! Well done."
                              : `Incorrect. The correct answer is: ${q.correctAnswer}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = course.lessons.findIndex((l) => l._id === activeLessonId);
                  if (idx > 0) setActiveLessonId(course.lessons[idx - 1]._id);
                }}
                disabled={course.lessons[0]._id === activeLessonId}
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary shadow-sm transition-colors hover:bg-surface-raised hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {!enrollment ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  Enroll to Track Progress
                </button>
              ) : !isLessonComplete ? (
                <button
                  onClick={() => handleMarkComplete(activeLesson._id)}
                  disabled={!allQuizzesAnswered || completing}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {completing ? "Saving..." : allQuizzesAnswered ? "Mark Complete & Continue →" : "Answer all questions to continue"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    const idx = course.lessons.findIndex((l) => l._id === activeLessonId);
                    if (idx < course.lessons.length - 1) setActiveLessonId(course.lessons[idx + 1]._id);
                  }}
                  disabled={course.lessons[course.lessons.length - 1]._id === activeLessonId}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}