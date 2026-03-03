"use client";

import FooterLink from "@/components/layouts/FooterLink";
import { Button } from "@/components/ui/button";
import { clientConfig } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.inviteCode.trim()) {
      newErrors.inviteCode = "Invite code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${clientConfig.apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          invite_code: formData.inviteCode,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Sign up failed");
      }
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-cerulean">
          Sign Up
        </h1>
        <p className="text-pacific mt-2">Sign up to use ProssFora</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className={`w-full px-4 py-2.5 border rounded-lg bg-card focus:outline-none focus:ring-2 transition-all ${
              errors.firstName
                ? "border-red-300 focus:ring-red-200"
                : "border-border focus:ring-ring focus:border-transparent"
            }`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className={`w-full px-4 py-2.5 border rounded-lg bg-card focus:outline-none focus:ring-2 transition-all ${
              errors.lastName
                ? "border-red-300 focus:ring-red-200"
                : "border-border focus:ring-ring focus:border-transparent"
            }`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg bg-card focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-border focus:ring-ring focus:border-transparent"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 pr-12 border rounded-lg bg-card focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-300 focus:ring-red-200"
                  : "border-border focus:ring-ring focus:border-transparent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pacific hover:text-cerulean transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cerulean mb-1.5">
            Invite Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleChange}
            placeholder="xxx-xxx-0000"
            className={`w-full px-4 py-2.5 border rounded-lg bg-card focus:outline-none focus:ring-2 transition-all ${
              errors.inviteCode
                ? "border-red-300 focus:ring-red-200"
                : "border-border focus:ring-ring focus:border-transparent"
            }`}
          />
          {errors.inviteCode && (
            <p className="text-sm text-red-500 mt-1">{errors.inviteCode}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yarrow hover:bg-yarrow-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6">
        <FooterLink
          text="Already have an account?"
          linkText="Sign into Account"
          href="/auth/sign-in"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
