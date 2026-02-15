"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

interface Grievance {
  id: string;
  title: string;
  description: string;
  status: string;
  studentId: string;
}

export default function ManageGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      const querySnapshot = await getDocs(collection(db, "grievances"));

      const data: Grievance[] = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Grievance, "id">),
      }));

      setGrievances(data);
    };

    fetchGrievances();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const docRef = doc(db, "grievances", id);
    await updateDoc(docRef, { status: newStatus });

    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: newStatus } : g
      )
    );
  };

  const getStatusColor = (status: string) => {
    if (status === "resolved") return "text-green-600";
    if (status === "in-progress") return "text-yellow-600";
    if (status === "rejected") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8">

      <h1 className="text-4xl font-bold text-white mb-10">
        Manage Grievances
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {grievances.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {g.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {g.description}
            </p>

            <p className={`font-semibold mb-6 ${getStatusColor(g.status)}`}>
              Status: {g.status}
            </p>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() => updateStatus(g.id, "in-progress")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                In Progress
              </button>

              <button
                onClick={() => updateStatus(g.id, "resolved")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Resolved
              </button>

              <button
                onClick={() => updateStatus(g.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
