"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const mockCourse = {
  id: "1",
  title: "Mastering System Design Interviews",
  topic: "System Design",
  difficulty: "Advanced",
  description:
    "Learn how to design scalable distributed systems. Covers load balancing, caching, databases, and real-world architecture patterns asked in top tech interviews.",
  createdBy: "Rahul Sharma",
  lessons: [
    {
      id: "l1",
      order: 1,
      title: "Scalability Fundamentals",
      content:
        "Scalability is the ability of a system to handle increased load. There are two primary types: vertical scaling (scaling up) involves adding more resources to an existing machine — more CPU, RAM, or storage. Horizontal scaling (scaling out) involves adding more machines to distribute the load.\n\nIn interviews, you should always clarify whether the system needs to scale reads, writes, or both. Most large-scale systems prefer horizontal scaling because it avoids a single point of failure and can grow indefinitely.\n\nKey concepts to mention: load balancers distribute traffic across servers, stateless services scale more easily since any server can handle any request, and database replication helps scale read-heavy workloads.",
      summary:
        "Scalability = handling more load. Vertical = bigger machine. Horizontal = more machines. Prefer horizontal for fault tolerance. Stateless services scale easiest. Load balancers + DB replication are your core tools.",
      quiz: [
        {
          id: "q1",
          question:
            "Which scaling strategy adds more machines to handle increased load?",
          options: [
            "Vertical scaling",
            "Horizontal scaling",
            "Diagonal scaling",
            "Deep scaling",
          ],
          correctAnswer: "Horizontal scaling",
        },
        {
          id: "q2",
          question:
            "Why do stateless services scale more easily than stateful ones?",
          options: [
            "They use less memory",
            "Any server can handle any request",
            "They don't require a database",
            "They run faster",
          ],
          correctAnswer: "Any server can handle any request",
        },
      ],
    },
    {
      id: "l2",
      order: 2,
      title: "Load Balancing Strategies",
      content:
        "A load balancer distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed. This improves reliability and availability.\n\nCommon load balancing algorithms include: Round Robin — requests are distributed sequentially across servers. Least Connections — traffic is sent to the server with the fewest active connections. IP Hash — the client's IP determines which server handles the request, ensuring session persistence.\n\nLoad balancers can operate at Layer 4 (transport layer — TCP/UDP) or Layer 7 (application layer — HTTP). Layer 7 load balancers can make smarter routing decisions based on request content, such as routing /api requests to API servers and /static to CDN servers.",
      summary:
        "Load balancer = traffic distributor. Algorithms: Round Robin, Least Connections, IP Hash. L4 = TCP/UDP level. L7 = HTTP level, smarter routing. Use L7 for content-based routing in modern systems.",
      quiz: [
        {
          id: "q3",
          question:
            "Which load balancing algorithm routes requests based on the client's IP address?",
          options: ["Round Robin", "Least Connections", "IP Hash", "Random"],
          correctAnswer: "IP Hash",
        },
        {
          id: "q4",
          question:
            "What is an advantage of Layer 7 load balancing over Layer 4?",
          options: [
            "It is faster",
            "It can route based on request content",
            "It uses less memory",
            "It works without a network",
          ],
          correctAnswer: "It can route based on request content",
        },
      ],
    },
    {
      id: "l3",
      order: 3,
      title: "Caching Patterns",
      content:
        "Caching stores frequently accessed data in fast storage (memory) to reduce latency and database load. Redis and Memcached are the most commonly used caching solutions in system design interviews.\n\nKey caching patterns: Cache-aside (lazy loading) — the application checks the cache first; on a miss, it fetches from DB and populates the cache. Write-through — data is written to cache and DB simultaneously. Write-back — data is written to cache first, then asynchronously to DB (risky but fast).\n\nCache eviction policies determine what gets removed when the cache is full. LRU (Least Recently Used) is the most common. TTL (Time to Live) sets an expiry on cached data to prevent stale reads.\n\nIn interviews, always discuss cache invalidation — it's one of the hardest problems in distributed systems.",
      summary:
        "Cache = fast memory store. Tools: Redis, Memcached. Patterns: Cache-aside (most common), Write-through, Write-back. Eviction: LRU. Always discuss TTL and cache invalidation in interviews.",
      quiz: [
        {
          id: "q5",
          question:
            "In the cache-aside pattern, when does data get loaded into the cache?",
          options: [
            "On every write",
            "On application startup",
            "On a cache miss",
            "On a schedule",
          ],
          correctAnswer: "On a cache miss",
        },
      ],
    },
    {
      id: "l4",
      order: 4,
      title: "Database Design & Sharding",
      content:
        "Choosing the right database is a critical system design decision. Relational databases (PostgreSQL, MySQL) are ideal for structured data with complex queries and strong consistency requirements. NoSQL databases (MongoDB, Cassandra, DynamoDB) offer flexible schemas and horizontal scaling for high-volume, distributed workloads.\n\nDatabase replication creates copies of your data across multiple nodes. Master-slave replication routes all writes to the master and reads to slaves, improving read throughput. Multi-master allows writes to multiple nodes but introduces conflict resolution complexity.\n\nSharding partitions data across multiple database instances. A shard key determines how data is distributed. Consistent hashing is a popular sharding strategy that minimizes data movement when nodes are added or removed.",
      summary:
        "SQL = structured, strong consistency. NoSQL = flexible, scales horizontally. Replication = copies for fault tolerance + read scaling. Sharding = horizontal partitioning. Use consistent hashing as your shard strategy.",
      quiz: [
        {
          id: "q6",
          question: "What is the purpose of sharding in a database?",
          options: [
            "To encrypt data",
            "To partition data across multiple instances",
            "To back up data",
            "To compress data",
          ],
          correctAnswer: "To partition data across multiple instances",
        },
      ],
    },
    {
      id: "l5",
      order: 5,
      title: "Putting It All Together",
      content:
        "In a system design interview, you'll typically be asked to design a system like Twitter, Uber, or Netflix. Here's a framework to approach any design question:\n\n1. Clarify requirements — functional (what the system does) and non-functional (scale, latency, availability).\n2. Estimate scale — DAU, requests per second, storage needs.\n3. High-level design — draw the major components: clients, load balancers, app servers, databases, caches, CDN.\n4. Deep dive — the interviewer will ask you to go deeper on specific components.\n5. Identify bottlenecks — discuss single points of failure, hotspots, and how you'd handle them.\n\nAlways think out loud. Interviewers care more about your reasoning process than the perfect answer.",
      summary:
        "Framework: Clarify → Estimate → High-level design → Deep dive → Bottlenecks. Always think out loud. Functional vs non-functional requirements. Draw components: LB, app servers, DB, cache, CDN.",
      quiz: [
        {
          id: "q7",
          question:
            "What should you clarify first in a system design interview?",
          options: [
            "The tech stack",
            "Functional and non-functional requirements",
            "The database schema",
            "The API endpoints",
          ],
          correctAnswer: "Functional and non-functional requirements",
        },
        {
          id: "q8",
          question: "What does DAU stand for in system design estimation?",
          options: [
            "Data Access Unit",
            "Daily Active Users",
            "Distributed Application Unit",
            "Dynamic Allocation Update",
          ],
          correctAnswer: "Daily Active Users",
        },
      ],
    },
  ],
};

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

type QuizState = Record<string, { selected: string; submitted: boolean }>;

export default function CoursePage() {
  const course = mockCourse;
  const [activeLessonId, setActiveLessonId] = useState(course.lessons[0].id);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );
  const [quizState, setQuizState] = useState<QuizState>({});
  const [enrolled, setEnrolled] = useState(false);

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId)!;
  const progress = Math.round(
    (completedLessons.size / course.lessons.length) * 100,
  );

  function markComplete(lessonId: string) {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  }

  function handleOptionSelect(quizId: string, option: string) {
    if (quizState[quizId]?.submitted) return;
    setQuizState((prev) => ({
      ...prev,
      [quizId]: { selected: option, submitted: false },
    }));
  }

  function handleSubmitQuiz(quizId: string) {
    if (!quizState[quizId]?.selected) return;
    setQuizState((prev) => ({
      ...prev,
      [quizId]: { ...prev[quizId], submitted: true },
    }));
  }

  const allQuizzesAnswered = activeLesson.quiz.every(
    (q) => quizState[q.id]?.submitted,
  );

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
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary no-underline transition-colors hover:text-primary"
        >
          ← Back to Dashboard
        </Link>

        {/* Course header */}
        <div className="mb-8 animate-fade-up">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${topicStyles[course.topic] ?? "bg-surface-raised text-muted"}`}
            >
              {course.topic}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[course.difficulty]}`}
            >
              {course.difficulty}
            </span>
            {completedLessons.size === course.lessons.length && (
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
            {!enrolled ? (
              <button
                onClick={() => setEnrolled(true)}
                className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Enroll Free
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
          {/* Sidebar — lesson list */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-surface p-3 shadow-sm">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted">
                Lessons
              </p>
              <ul className="space-y-1">
                {course.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  const isDone = completedLessons.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border-none px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                          isActive
                            ? "bg-accent/10 font-semibold text-accent"
                            : "bg-transparent text-secondary hover:bg-surface-raised hover:text-primary"
                        }`}
                      >
                        {/* Status icon */}
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isDone
                              ? "bg-success text-white"
                              : isActive
                                ? "bg-accent text-white"
                                : "bg-surface-raised text-muted"
                          }`}
                        >
                          {isDone ? "✓" : lesson.order}
                        </span>
                        <span className="line-clamp-2 leading-snug">
                          {lesson.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Lesson header */}
            <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Lesson {activeLesson.order}
                </span>
                {completedLessons.has(activeLesson.id) && (
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                )}
              </div>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-primary">
                {activeLesson.title}
              </h2>

              {/* Content */}
              <div className="prose prose-sm max-w-none">
                {activeLesson.content.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="mb-4 text-sm leading-relaxed text-secondary last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                Quick Revision Summary
              </p>
              <p className="text-sm leading-relaxed text-secondary">
                {activeLesson.summary}
              </p>
            </div>

            {/* Quiz section */}
            <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
                Knowledge Check
              </p>

              <div className="space-y-6">
                {activeLesson.quiz.map((q) => {
                  const state = quizState[q.id];
                  const submitted = state?.submitted ?? false;

                  return (
                    <div key={q.id}>
                      <p className="mb-3 text-sm font-semibold text-primary">
                        {q.question}
                      </p>
                      <ul className="space-y-2">
                        {q.options.map((option) => {
                          const isSelected = state?.selected === option;
                          const isCorrect = option === q.correctAnswer;

                          let optionStyle =
                            "border-border bg-surface text-secondary hover:border-accent/40 hover:bg-accent/5";

                          if (submitted) {
                            if (isCorrect) {
                              optionStyle =
                                "border-green-300 bg-green-50 text-green-800 font-medium";
                            } else if (isSelected && !isCorrect) {
                              optionStyle =
                                "border-red-300 bg-red-50 text-red-800";
                            } else {
                              optionStyle =
                                "border-border bg-surface text-muted";
                            }
                          } else if (isSelected) {
                            optionStyle =
                              "border-accent bg-accent/10 text-accent font-medium";
                          }

                          return (
                            <li key={option}>
                              <button
                                onClick={() => handleOptionSelect(q.id, option)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150 ${optionStyle}`}
                              >
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs ${
                                    isSelected && !submitted
                                      ? "border-accent bg-accent text-white"
                                      : submitted && isCorrect
                                        ? "border-green-500 bg-green-500 text-white"
                                        : submitted && isSelected && !isCorrect
                                          ? "border-red-500 bg-red-500 text-white"
                                          : "border-border"
                                  }`}
                                >
                                  {submitted && isCorrect
                                    ? "✓"
                                    : submitted && isSelected && !isCorrect
                                      ? "✗"
                                      : ""}
                                </span>
                                {option}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {!submitted && (
                        <button
                          onClick={() => handleSubmitQuiz(q.id)}
                          disabled={!state?.selected}
                          className="mt-3 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Check Answer
                        </button>
                      )}

                      {submitted && (
                        <p
                          className={`mt-2 text-xs font-medium ${
                            state.selected === q.correctAnswer
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
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

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = course.lessons.findIndex(
                    (l) => l.id === activeLessonId,
                  );
                  if (idx > 0) setActiveLessonId(course.lessons[idx - 1].id);
                }}
                disabled={course.lessons[0].id === activeLessonId}
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary shadow-sm transition-colors hover:bg-surface-raised hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {!completedLessons.has(activeLesson.id) ? (
                <button
                  onClick={() => {
                    markComplete(activeLesson.id);
                    const idx = course.lessons.findIndex(
                      (l) => l.id === activeLessonId,
                    );
                    if (idx < course.lessons.length - 1) {
                      setActiveLessonId(course.lessons[idx + 1].id);
                    }
                  }}
                  disabled={!allQuizzesAnswered}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {allQuizzesAnswered
                    ? "Mark Complete & Continue →"
                    : "Answer all questions to continue"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    const idx = course.lessons.findIndex(
                      (l) => l.id === activeLessonId,
                    );
                    if (idx < course.lessons.length - 1) {
                      setActiveLessonId(course.lessons[idx + 1].id);
                    }
                  }}
                  disabled={
                    course.lessons[course.lessons.length - 1].id ===
                    activeLessonId
                  }
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
