"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
}

export default function Internships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      const snapshot = await getDocs(collection(db, "internships"));

      const data: Internship[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Internship, "id">),
      }));

      setInternships(data);
    };

    fetchInternships();
  }, []);

  const handleApply = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    if (!resumeLink) return alert("Please paste resume link");

    await addDoc(collection(db, "internshipApplications"), {
      internshipId: selectedInternship?.id,
      internshipTitle: selectedInternship?.title,
      studentId: user.uid,
      studentEmail: user.email,
      resumeLink,
      status: "pending",
      appliedAt: serverTimestamp(),
    });

    alert("Application Submitted!");
    setSelectedInternship(null);
    setResumeLink("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        Internship Opportunities
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {internships.map((intern) => (
          <div
            key={intern.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {intern.title}
            </h3>
            <p className="text-blue-600 font-medium mb-2">
              {intern.company}
            </p>
            <p className="text-gray-600 mb-4">
              {intern.description}
            </p>

            <button
              onClick={() => setSelectedInternship(intern)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Apply for {selectedInternship.title}
            </h2>

            <input
              type="text"
              placeholder="Paste Resume Google Drive Link"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="w-full border p-3 rounded-lg mb-6"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
