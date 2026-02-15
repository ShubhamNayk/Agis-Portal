"use client";

import { useState } from "react";
import { db, auth } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function UploadResource() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [link, setLink] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    await addDoc(collection(db, "resources"), {
      title,
      subject,
      link,
      uploadedBy: user.uid,
      createdAt: serverTimestamp(),
    });

    alert("Resource Uploaded!");
    router.push("/faculty");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-6">
      
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Upload Academic Resource
        </h1>

        <input
          type="text"
          placeholder="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Resource Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Upload Resource
        </button>
      </div>
    </div>
  );
}
