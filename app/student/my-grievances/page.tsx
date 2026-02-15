"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Grievance {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function MyGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    const fetchMyGrievances = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "grievances"),
        where("studentId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const data: Grievance[] = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Grievance, "id">),
      }));

      setGrievances(data);
    };

    fetchMyGrievances();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "resolved") return "text-green-600";
    if (status === "in-progress") return "text-yellow-600";
    if (status === "rejected") return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        My Grievances
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
            <p className={`font-semibold ${getStatusColor(g.status)}`}>
              Status: {g.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
