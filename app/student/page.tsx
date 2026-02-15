"use client";

import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function StudentDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email ?? "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 p-8">

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Student Dashboard
          </h1>
          <p className="text-white mt-2">
            Logged in as:{" "}
            <span className="font-semibold">{userEmail}</span>
          </p>
        </div>

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
            onClick={() => router.push("/student/enroll")}
            className="p-8 bg-orange-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-orange-700 mb-3">
              Enroll Faculty
            </h2>
          </div>

          <div
            onClick={() => router.push("/student/my-applications")}
            className="p-8 bg-green-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              My Applications
            </h2>
          </div>

          <div
            onClick={() => router.push("/student/resources")}
            className="p-8 bg-purple-50 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
          >
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">
              My Resources
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
