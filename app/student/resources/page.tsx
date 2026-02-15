"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface Resource {
  id: string;
  title: string;
  subject: string;
  link: string;
  uploadedBy: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get enrolled faculty
      const enrollQuery = query(
        collection(db, "enrollments"),
        where("studentId", "==", user.uid)
      );

      const enrollSnapshot = await getDocs(enrollQuery);

      const facultyIds = enrollSnapshot.docs.map(
        (doc) => doc.data().facultyId
      );

      if (facultyIds.length === 0) {
        setResources([]);
        return;
      }

      const resourceSnapshot = await getDocs(collection(db, "resources"));

      const filteredResources: Resource[] = resourceSnapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Resource, "id">),
        }))
        .filter((res) => facultyIds.includes(res.uploadedBy));

      setResources(filteredResources);
    };

    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-10">
        My Faculty Resources
      </h1>

      {resources.length === 0 && (
        <p className="text-white">
          No resources available. Please enroll in a faculty.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {res.title}
            </h3>
            <p className="text-indigo-600 mb-2">
              {res.subject}
            </p>

            <a
              href={res.link}
              target="_blank"
              className="text-blue-600 underline"
            >
              Open Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
