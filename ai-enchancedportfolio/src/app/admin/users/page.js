"use client";

import { useState, useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch users when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users", data.error);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Handle adding a new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, isAdmin }),
      });

      const data = await response.json();
      if (data.success) {
        // Add the new user to the user list without re-fetching
        setUsers((prevUsers) => [...prevUsers, data.user]);
        setUsername("");
        setEmail("");
        setIsAdmin(false);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setErrorMessage("Failed to create user");
    }
  };

  // Handle approve (promote to admin)
  const handleApprove = async (userId) => {
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: true }),
      });

      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId ? { ...user, isAdmin: true } : user
          )
        );
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  // Handle remove (delete user)
  const handleRemove = async (userId) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
      }
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <p>Here you can view, approve, or remove artist accounts.</p>

      {/* Add New User Form */}
      <div className="mt-6">
        <h2 className="text-xl mb-2">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="text-indigo-600"
              />
              <span className="text-sm">Make this user an Admin</span>
            </label>
          </div>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Display Users Table */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="mt-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.isAdmin ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleApprove(user.userId)}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => handleRemove(user.userId)}
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