"use client";

import UserProfileCard from "@/components/cards/UserCards";
import api from "@/lib/api";
import { User } from "@/lib/types/user";
import axios from "axios";
import type { UserRole } from "@/lib/types/enums";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SingleUserPage = () => {
  const params = useParams();
  const userId = params?.id as string | undefined;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleSuccess, setRoleSuccess] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [toggleActiveLoading, setToggleActiveLoading] = useState(false);
  const [toggleActiveError, setToggleActiveError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleError) return;
    const t = setTimeout(() => setRoleError(null), 5000);
    return () => clearTimeout(t);
  }, [roleError]);

  useEffect(() => {
    if (!roleSuccess) return;
    const t = setTimeout(() => setRoleSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [roleSuccess]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    api
      .get(`users/${userId}`)
      .then((response) => {
        const userData = response.data?.data;

        if (!userData) {
          setError("User not found.");
        } else {
          setUser(userData);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

 
  if (loading) return <div className="p-4">Loading user...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">No user found.</div>;

  const handleToggleActive = async (userId: string, currentIsActive: boolean) => {
    setToggleActiveError(null);
    setToggleActiveLoading(true);
    try {
      const { data } = await api.patch<{ success: boolean; data?: Partial<User> }>(
        `users/${userId}`,
        { is_active: !currentIsActive },
      );
      if (data?.success && data?.data) {
        setUser((prev) => (prev ? { ...prev, ...data.data } : null));
      } else {
        setUser((prev) => (prev ? { ...prev, is_active: !currentIsActive } : null));
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? (err.response.data.message as string)
          : "Failed to update account status";
      setToggleActiveError(message);
    } finally {
      setToggleActiveLoading(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    setResetPasswordError(null);
    setResetPasswordSuccess(false);
    setResetPasswordLoading(true);
    try {
      await api.post(`users/${userId}/reset-password`);
      setResetPasswordSuccess(true);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? (err.response.data.message as string)
          : "Failed to send reset email";
      setResetPasswordError(message);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setRoleError(null);
    try {
      const { data } = await api.patch<{
        success: boolean;
        data?: Partial<User>;
        message?: string;
      }>(`users/${userId}/role/update`, { role: newRole });
      if (data?.success && data?.data) {
        setUser((prev) => (prev ? { ...prev, ...data.data } : null));
        setRoleSuccess(true);
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? (err.response.data.message as string)
          : "Failed to update role";
      setRoleError(message);
      throw new Error(message);
    }
  };

  return (
    <div className="p-4">
      <UserProfileCard
        user={user}
        onRoleChange={handleRoleChange}
        roleError={roleError}
        onClearRoleError={() => setRoleError(null)}
        roleSuccess={roleSuccess}
        onResetPassword={handleResetPassword}
        resetPasswordLoading={resetPasswordLoading}
        resetPasswordError={resetPasswordError}
        resetPasswordSuccess={resetPasswordSuccess}
        onClearResetPasswordError={() => setResetPasswordError(null)}
        onToggleActive={handleToggleActive}
        toggleActiveLoading={toggleActiveLoading}
        toggleActiveError={toggleActiveError}
        onClearToggleActiveError={() => setToggleActiveError(null)}
      />
    </div>
  );
};

export default SingleUserPage;
