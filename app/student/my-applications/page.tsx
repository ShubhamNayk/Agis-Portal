"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface Application {
  id: string;
  internshipTitle: string;
  resumeLink: string;
  status: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "internshipApplications"),
        where("studentId", "==", user.uid)
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

  const getStatusColor = (status: string) => {
    if (status === "approved") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        My Internship Applications
      </h1>

      {applications.length === 0 && (
        <p className="text-white">
          You have not applied to any internships yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {app.internshipTitle}
            </h3>

            <a
              href={app.resumeLink}
              target="_blank"
              className="text-blue-600 underline mb-3 block"
            >
              View Submitted Resume
            </a>

            <p
              className={`font-semibold ${getStatusColor(app.status)}`}
            >
              Status: {app.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
