"use client";

import { useState } from "react";
import { db, auth } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PostInternship() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    await addDoc(collection(db, "internships"), {
      title,
      company,
      description,
      postedBy: user.uid,
      createdAt: serverTimestamp(),
    });

    alert("Internship Posted!");
    router.push("/faculty");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Post Internship
        </h1>

        <input
          type="text"
          placeholder="Internship Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Post Internship
        </button>
      </div>
    </div>
  );
}
