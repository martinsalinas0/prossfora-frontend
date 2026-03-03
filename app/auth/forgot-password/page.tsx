"use client";

import FooterLink from "@/components/layouts/FooterLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("auth/forgot-password", {
        email: email.trim(),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-cerulean">
            Check your email
          </h1>
          <p className="text-pacific mt-2">
            If an account exists for {email}, we’ve sent instructions to reset your password.
          </p>
        </div>
        <Link
          href="/auth/sign-in"
          className="inline-block w-full text-center px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-cerulean">
          Forgot password?
        </h1>
        <p className="text-pacific mt-2">
          Enter your email and we’ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-border focus:ring-ring"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yarrow hover:bg-yarrow-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6">
        <FooterLink
          text="Remember your password?"
          linkText="Sign In"
          href="/auth/sign-in"
        />
      </div>
    </div>
  );
}
