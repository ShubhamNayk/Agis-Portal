"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

interface Faculty {
  id: string;
  email: string;
  role: string;
}

export default function EnrollPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const data: Faculty[] = snapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Faculty, "id">),
        }))
        .filter((user) => user.role === "faculty");

      setFacultyList(data);
    };

    fetchFaculty();
  }, []);

  const handleEnroll = async (facultyId: string, facultyEmail: string) => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    await addDoc(collection(db, "enrollments"), {
      studentId: user.uid,
      facultyId,
      facultyEmail,
      createdAt: serverTimestamp(),
    });

    alert("Enrolled Successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        Enroll Under Faculty
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {facultyList.map((faculty) => (
          <div
            key={faculty.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              {faculty.email}
            </h3>

            <button
              onClick={() =>
                handleEnroll(faculty.id, faculty.email)
              }
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
