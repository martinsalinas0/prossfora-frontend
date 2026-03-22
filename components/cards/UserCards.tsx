"use client";

import { User } from "@/lib/types/user";
import type { UserRole } from "@/lib/types/enums";
import { ArrowLeft, Mail, Phone, Calendar, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
];

interface UserProfileCardProps {
  user: User;
  onRoleChange?: (userId: string, newRole: UserRole) => Promise<void>;
  roleError?: string | null;
  onClearRoleError?: () => void;
  roleSuccess?: boolean;
  onResetPassword?: (userId: string) => Promise<void>;
  resetPasswordLoading?: boolean;
  resetPasswordError?: string | null;
  resetPasswordSuccess?: boolean;
  onClearResetPasswordError?: () => void;
  onToggleActive?: (userId: string, currentIsActive: boolean) => Promise<void>;
  toggleActiveLoading?: boolean;
  toggleActiveError?: string | null;
  onClearToggleActiveError?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onRoleChange,
  roleError,
  onClearRoleError,
  roleSuccess,
  onResetPassword,
  resetPasswordLoading,
  resetPasswordError,
  resetPasswordSuccess,
  onClearResetPasswordError,
  onToggleActive,
  toggleActiveLoading,
  toggleActiveError,
  onClearToggleActiveError,
}) => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(user.role as UserRole);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    setRole(user.role as UserRole);
  }, [user.role]);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    if (newRole === role) return;
    setRole(newRole);
    if (onRoleChange) {
      setUpdatingRole(true);
      try {
        await onRoleChange(user.id, newRole);
      } catch {
        setRole(role);
      } finally {
        setUpdatingRole(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-linear-to-br from-cerulean to-pacific p-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg text-3xl font-bold text-cerulean">
                  {user.first_name.charAt(0)}
                  {user.last_name.charAt(0)}
                </div>
              </div>

              <div className="p-6 text-center border-b">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
                  {role}
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                        : "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20"
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-cerulean mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-cerulean hover:underline break-all"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-cerulean mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    {user.phone ? (
                      <a
                        href={`tel:${user.phone}`}
                        className="text-sm text-cerulean hover:underline"
                      >
                        {user.phone}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    User ID
                  </p>
                  <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg">
                    {user.id.slice(-12)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Role
                  </p>
                  <select
                    value={role}
                    onChange={handleRoleChange}
                    disabled={updatingRole || !onRoleChange}
                    className="w-full text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 capitalize focus:outline-none focus:ring-2 focus:ring-cerulean focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {roleError && (
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-red-600 flex-1">{roleError}</p>
                      {onClearRoleError && (
                        <button
                          type="button"
                          onClick={onClearRoleError}
                          className="text-xs text-red-600 hover:text-red-800 underline shrink-0"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  )}
                  {roleSuccess && (
                    <p className="text-xs text-green-600 mt-1">Role updated.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Employee Since
                    </p>
                  </div>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Last Login
                    </p>
                  </div>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Account Actions
              </h2>

              <div className="flex flex-wrap gap-3">
                <Link href={`/admin/users/update/${user.id}`}>
                  <button className="px-6 py-2.5 bg-cerulean text-white rounded-lg font-medium hover:bg-pacific transition-colors shadow-sm">
                    Edit Profile
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => onResetPassword?.(user.id)}
                  disabled={resetPasswordLoading || !onResetPassword}
                  className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetPasswordLoading ? "Sending…" : "Reset Password"}
                </button>
                {resetPasswordError && (
                  <div className="flex items-center gap-2 w-full basis-full">
                    <p className="text-sm text-red-600">{resetPasswordError}</p>
                    {onClearResetPasswordError && (
                      <button
                        type="button"
                        onClick={onClearResetPasswordError}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                )}
                {resetPasswordSuccess && (
                  <p className="text-sm text-green-600 basis-full">
                    Reset password email sent.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => onToggleActive?.(user.id, user.is_active)}
                  disabled={toggleActiveLoading || !onToggleActive}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    user.is_active
                      ? "bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100"
                      : "bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {toggleActiveLoading
                    ? "Updating…"
                    : user.is_active
                      ? "Deactivate Account"
                      : "Activate Account"}
                </button>
                {toggleActiveError && (
                  <div className="flex items-center gap-2 w-full basis-full">
                    <p className="text-sm text-red-600">{toggleActiveError}</p>
                    {onClearToggleActiveError && (
                      <button
                        type="button"
                        onClick={onClearToggleActiveError}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
