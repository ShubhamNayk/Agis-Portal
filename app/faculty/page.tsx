"use client";

import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

export default function FacultyDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">
          Faculty Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <div className="grid md:grid-cols-2 gap-8">

          <div
            onClick={() => router.push("/faculty/post-internship")}
            className="p-8 bg-indigo-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              Post Internship
            </h2>
          </div>

          <div
            onClick={() => router.push("/faculty/upload-resource")}
            className="p-8 bg-purple-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">
              Upload Resource
            </h2>
          </div>

          <div
            onClick={() => router.push("/faculty/view-applications")}
            className="p-8 bg-green-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              View Applications
            </h2>
          </div>

          <div
            onClick={() => router.push("/lost-found")}
            className="p-8 bg-pink-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-pink-700 mb-3">
              Lost & Found
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}
