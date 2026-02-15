"use client";

import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-pink-500 to-purple-700 p-6 shadow-2xl">

        <h2 className="text-2xl font-bold mb-8">AEGIS Portal</h2>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/student")}
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-10">{title}</h1>
        {children}
      </div>
    </div>
  );
}
