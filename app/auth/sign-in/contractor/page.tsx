"use client";

import FooterLink from "@/components/layouts/FooterLink";
import { clientConfig } from "@/lib/config";
import {
  setAccessToken,
  setRefreshToken,
  setUser,
  setContractorId,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ContractorSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      setError("Session expired. Please sign in again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${clientConfig.apiUrl}/auth/login/contractor`,
        {
          email: email.trim(),
          password,
        }
      );
      const token =
        res.data?.data?.accessToken ??
        res.data?.accessToken ??
        res.data?.data?.token ??
        res.data?.token;
      if (token) {
        setAccessToken(token);
        const refresh =
          res.data?.data?.refreshToken ?? res.data?.refreshToken;
        if (refresh) setRefreshToken(refresh);
        const contractor = res.data?.data?.contractor;
        if (contractor) {
          setUser({
            first_name: contractor.first_name,
            last_name: contractor.last_name,
            email: contractor.email,
          });
          setContractorId(contractor.id);
        }
      }
      router.push("/contractor");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-cerulean">
          Contractor Sign In
        </h1>
        <p className="text-pacific mt-2">
          Sign in to view your jobs and invoices
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-cerulean">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-pacific hover:text-pacific-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-border focus:ring-ring"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yarrow hover:bg-yarrow-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6">
        <FooterLink
          text="Admin or staff?"
          linkText="Sign in here"
          href="/auth/sign-in"
        />
      </div>
    </div>
  );
}
