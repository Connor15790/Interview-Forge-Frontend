"use client";

import { useState } from "react";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const user = session?.user;
  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2.5 text-sm font-bold tracking-tight text-primary no-underline"
        >
          <span className="inline-block h-6 w-6 rounded-lg bg-accent shadow-accent" />
          CourseForge
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 no-underline ${pathname === href
                ? "bg-surface-raised text-primary"
                : "text-secondary hover:bg-surface-raised hover:text-primary"
                }`}
            >
              {label}
              {pathname === href && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <span
                className={`hidden rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest sm:inline-flex ${user.plan === "pro"
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-border bg-surface-raised text-muted"
                  }`}
              >
                {user.plan === "pro" ? "Pro" : "Free"}
              </span>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-border bg-surface-raised transition-colors duration-150 hover:border-muted"
                  aria-label="User menu"
                >
                  {user.image && !avatarError ? (
                    <img
                      src={user.image}
                      alt={user.name ?? "User"}
                      className="h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-accent text-xs font-semibold text-white">
                      {initial}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-primary">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-secondary">
                        {user.email}
                      </p>
                    </div>
                    <div className="h-px bg-border" />
                    {user.plan === "free" && (
                      <>
                        <Link
                          href="/upgrade-pro"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-secondary no-underline transition-colors hover:bg-surface-raised hover:text-primary"
                        >
                          <span className="text-accent">★</span>
                          Upgrade to Pro
                        </Link>
                        <div className="h-px bg-border" />
                      </>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full cursor-pointer items-center border-none bg-transparent px-4 py-2.5 text-left text-sm font-medium text-error transition-colors hover:bg-surface-raised"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-accent-hover"
            >
              Sign in
            </Link>
          )}

          <button
            className="flex cursor-pointer flex-col gap-1.5 border-none bg-transparent p-1 md:hidden"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-5 rounded-sm bg-secondary" />
            <span className="block h-0.5 w-5 rounded-sm bg-secondary" />
            <span className="block h-0.5 w-5 rounded-sm bg-secondary" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-border px-6 py-3 md:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${pathname === href
                ? "bg-surface-raised text-primary"
                : "text-secondary hover:text-primary"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
