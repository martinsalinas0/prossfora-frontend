"use client";

import UserCard from "@/components/cards/UserCards";
import api from "@/lib/api";
import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";

//comment

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("users/getAllUsers")
      .then((response) => {
        setUsers((response.data.data ?? []) as User[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-pacific">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cerulean mb-6">Users</h1>

      <p className="text-sm text-muted mb-4">Total Users: {users.length}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {users.length === 0 && <p className="text-pacific">No users found</p>}
    </div>
  );
};

export default AdminUsersPage;
