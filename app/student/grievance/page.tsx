"use client";

import { useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function GrievancePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    await addDoc(collection(db, "grievances"), {
      title,
      description,
      studentId: user.uid,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Grievance Submitted!");
    router.push("/student");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Submit Grievance
        </h1>

        <input
          type="text"
          placeholder="Grievance Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <textarea
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
