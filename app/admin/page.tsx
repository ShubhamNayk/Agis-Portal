"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data: User[] = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<User, "id">),
    }));
    setUsers(data);
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateDoc(doc(db, "users", userId), {
      role: newRole,
    });

    fetchUsers();
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Manage User Roles
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300"
            >
              <p className="text-lg font-medium text-gray-700">
                {user.email}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Current Role: <span className="font-semibold">{user.role}</span>
              </p>

              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="authority">Authority</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
