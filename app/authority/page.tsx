"use client";

import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

export default function AuthorityDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 p-8">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">
          Authority Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-white text-red-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <div className="grid md:grid-cols-2 gap-8">

          <div
            onClick={() => router.push("/authority/manage-grievances")}
            className="p-8 bg-red-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-red-700 mb-3">
              Manage Grievances
            </h2>
            <p className="text-gray-600">
              Review and update student grievances.
            </p>
          </div>

          <div
            onClick={() => router.push("/lost-found")}
            className="p-8 bg-pink-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-pink-700 mb-3">
              Lost & Found
            </h2>
            <p className="text-gray-600">
              View and manage lost & found items.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
