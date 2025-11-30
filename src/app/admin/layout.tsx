"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthorized, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthorized) {
      router.push("/login");
    }
  }, [loading, isAuthorized, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-synth-muted">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-void">
      <header className="bg-deep-purple border-b border-neon-pink/30 shadow-neon-pink-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-8">
              <span className="font-orbitron text-lg font-bold gradient-text hidden sm:block">
                ADMIN
              </span>
              <nav className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pathname === "/admin"
                      ? "text-neon-pink bg-neon-pink/10 shadow-neon-pink-sm"
                      : "text-synth-muted hover:text-neon-cyan hover:bg-neon-cyan/5"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/new"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pathname === "/admin/new"
                      ? "text-neon-pink bg-neon-pink/10 shadow-neon-pink-sm"
                      : "text-synth-muted hover:text-neon-cyan hover:bg-neon-cyan/5"
                  }`}
                >
                  New Post
                </Link>
              </nav>
            </div>

            {/* User info & Sign out */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-synth-muted hidden sm:block font-mono">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-neon-orange hover:text-white hover:bg-neon-orange/20 rounded-lg transition-all font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
