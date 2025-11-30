"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading, isAuthorized, signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      router.push("/admin");
    }
  }, [isAuthorized, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-synth-gradient">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-synth-muted font-space">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-synth-gradient">
        <div className="max-w-md w-full text-center bg-deep-purple/80 backdrop-blur-sm border border-neon-pink/30 rounded-lg p-8 shadow-neon-pink-sm">
          <h1 className="text-2xl font-orbitron font-bold mb-4 text-neon-pink">Access Denied</h1>
          <p className="text-synth-muted mb-4 font-space">
            You are logged in as <span className="text-neon-cyan font-mono">{user.email}</span>, but this account is not authorized to access the admin area.
          </p>
        </div>
      </div>
    );
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 bg-deep-purple border border-grid/50 rounded-lg text-synth-text placeholder:text-synth-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-sm transition-all font-space";
  const labelStyles = "block text-sm font-medium text-synth-muted mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-synth-gradient relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold gradient-text mb-2">SIGN IN</h1>
          <p className="text-synth-muted font-space">Access the control panel</p>
        </div>

        {/* Card */}
        <div className="bg-deep-purple/80 backdrop-blur-sm border border-grid/50 rounded-lg p-8 shadow-lg">
          {error && (
            <div role="alert" className="bg-neon-pink/10 border border-neon-pink/50 text-neon-pink px-4 py-3 rounded-lg mb-6 font-space">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-5 mb-6">
            <div>
              <label htmlFor="email" className={labelStyles}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelStyles}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neon-pink text-white py-3 px-4 rounded-lg font-medium font-orbitron tracking-wider hover:shadow-neon-pink disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-grid/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-deep-purple text-synth-muted font-space">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full bg-void border border-grid/50 text-synth-text py-3 px-4 rounded-lg font-medium font-space hover:border-neon-cyan hover:shadow-neon-cyan-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-grid text-sm mt-6 font-mono">
          SECURE • ENCRYPTED • AUTHORIZED
        </p>
      </div>
    </div>
  );
}
