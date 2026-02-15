"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

interface Application {
  id: string;
  studentEmail: string;
  internshipTitle: string;
  resumeLink: string;
  status: string;
}

export default function ViewApplications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "internshipApplications"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const data: Application[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Application, "id">),
      }));

      setApplications(data);
    };

    fetchApplications();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const docRef = doc(db, "internshipApplications", id);

    await updateDoc(docRef, { status: newStatus });

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        Internship Applications
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {app.studentEmail}
            </h3>

            <p className="text-gray-600 mb-2">
              Internship: {app.internshipTitle}
            </p>

            <a
              href={app.resumeLink}
              target="_blank"
              className="text-blue-600 underline mb-4 block"
            >
              View Resume
            </a>

            <p className="mb-4 font-semibold">
              Status: {app.status}
            </p>

            {app.status === "pending" && (
              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus(app.id, "approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
