"use client";

import DashboardLayout from "components/DashboardLayout";
import { useState, useEffect, useMemo } from "react";

export default function AdminUsers() {
  const [tempPassword, setTempPassword] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    isAdmin: false,
    isArtist: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      else setErrorMessage(data.error || "Failed to fetch users");
    } catch {
      setErrorMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email)
      return setErrorMessage("Please fill in all fields.");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      setUsers((prev) => [...prev, data.user]);
      setForm({ username: "", email: "", isAdmin: false, isArtist: false });
      setTempPassword(data.tempPassword);
      setNewUserEmail(data.user.email);
      setErrorMessage("");
    } else setErrorMessage(data.error || "Failed to create user");
  };

  const handleToggleRole = async (userId, roleType, value) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [roleType]: value }),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId ? { ...u, [roleType]: value } : u
      )
    );
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole =
        role === ""
          ? true
          : role === "Admin"
          ? u.isAdmin
          : role === "Artist"
          ? u.isArtist
          : !u.isAdmin && !u.isArtist;
      return matchSearch && matchRole;
    });
  }, [users, search, role]);

  if (loading)
    return <p className="p-8 text-gray-500">Loading users...</p>;

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          User Management
        </h1>

        {/* 🧾 Add User Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white shadow-sm rounded-xl space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">Add New User</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-6 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={() =>
                  setForm((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
                }
              />
              Admin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isArtist}
                onChange={() =>
                  setForm((prev) => ({ ...prev, isArtist: !prev.isArtist }))
                }
              />
              Artist
            </label>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add User
          </button>

          {tempPassword && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-semibold">User created successfully!</p>
              <p>Email: <span className="font-medium">{newUserEmail}</span></p>
              <p>
                Temporary password:{" "}
                <span className="font-mono bg-white px-2 py-1 border rounded">
                  {tempPassword}
                </span>
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword);
                  alert("Password copied!");
                }}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Copy password
              </button>
            </div>
          )}
        </form>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Artist">Artist</option>
            <option value="User">Regular User</option>
          </select>
        </div>

        {/* 👥 Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Username</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium text-center">Admin</th>
                <th className="px-6 py-3 font-medium text-center">Artist</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3">{u.username}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={u.isAdmin}
                      onChange={(e) =>
                        handleToggleRole(u.userId, "isAdmin", e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={u.isArtist}
                      onChange={(e) =>
                        handleToggleRole(u.userId, "isArtist", e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(u.userId)}
                      className="text-red-600 hover:text-red-700 font-medium transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}