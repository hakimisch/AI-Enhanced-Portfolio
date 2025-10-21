"use client";

import { useState, useEffect } from "react";

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

  // ✅ Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      } else {
        setErrorMessage(data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or update user
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.username || !form.email) {
    setErrorMessage("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setUsers((prev) => [...prev, data.user]);
      setForm({ username: "", email: "", isAdmin: false, isArtist: false });
      setErrorMessage("");

      // ✅ Show the generated temp password
      setTempPassword(data.tempPassword);
      setNewUserEmail(data.user.email);
    } else {
      setErrorMessage(data.error || "Failed to create user");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    setErrorMessage("Failed to create user");
  }
};

  // ✅ Toggle role (Admin / Artist)
  const handleToggleRole = async (userId, roleType, value) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, [roleType]: value }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === userId ? { ...u, [roleType]: value } : u
          )
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // ✅ Remove user
  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <p className="p-8">Loading users...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>

      {/* 🔹 Add User Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 border rounded bg-white shadow-sm space-y-4"
      >
        <h2 className="text-xl font-medium mb-2">Add New User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isAdmin}
              onChange={() =>
                setForm((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
              }
            />
            Make Admin
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isArtist}
              onChange={() =>
                setForm((prev) => ({ ...prev, isArtist: !prev.isArtist }))
              }
            />
            Make Artist
          </label>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
        {tempPassword && (
  <div className="mt-4 p-4 border rounded bg-green-50 text-green-800">
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
    <button
      onClick={() => setTempPassword(null)}
      className="mt-2 ml-4 text-sm text-gray-500 hover:underline"
    >
      Dismiss
    </button>
  </div>
)}
      </form>

      {/* 🔹 Users Table */}
      <h2 className="text-xl font-medium mb-3">All Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Admin</th>
                <th className="border px-4 py-2">Artist</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td className="border px-4 py-2">{u.username}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={u.isAdmin}
                      onChange={(e) =>
                        handleToggleRole(u.userId, "isAdmin", e.target.checked)
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={u.isArtist}
                      onChange={(e) =>
                        handleToggleRole(u.userId, "isArtist", e.target.checked)
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(u.userId)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}