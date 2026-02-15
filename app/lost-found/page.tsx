"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

interface Item {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  location: string;
  userEmail: string;
}

export default function LostFoundPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");

  const [type, setType] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // ✅ Fetch Items Safe Version
  useEffect(() => {
    const loadItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, "lostFound"));

        const data: Item[] = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Item, "id">),
        }));

        // Latest first
        setItems([...data].reverse());
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    loadItems();
  }, []);

  // ✅ Submit Post
  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Not logged in");
      return;
    }

    if (!title || !description || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "lostFound"), {
        type,
        title,
        description,
        location,
        postedBy: user.uid,
        userEmail: user.email ?? "No Email",
        createdAt: serverTimestamp(),
      });

      alert("Posted Successfully!");

      setTitle("");
      setDescription("");
      setLocation("");

      // Refresh after post
      const snapshot = await getDocs(collection(db, "lostFound"));

      const data: Item[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Item, "id">),
      }));

      setItems([...data].reverse());
    } catch (error) {
      console.error("Error posting item:", error);
      alert("Something went wrong");
    }
  };

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Lost & Found Portal
      </h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "all"
              ? "bg-white text-black"
              : "bg-white/20 text-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("lost")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "lost"
              ? "bg-red-500 text-white"
              : "bg-white/20 text-white"
          }`}
        >
          Lost
        </button>

        <button
          onClick={() => setFilter("found")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "found"
              ? "bg-green-500 text-white"
              : "bg-white/20 text-white"
          }`}
        >
          Found
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          Report Item
        </h2>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "lost" | "found")
          }
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="lost">Lost Item</option>
          <option value="found">Found Item</option>
        </select>

        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Post
        </button>
      </div>

      {/* ITEMS */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {item.title}
            </h3>

            <p className="mb-2">
              <span className="font-semibold">Type:</span>{" "}
              <span
                className={
                  item.type === "lost"
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {item.type.toUpperCase()}
              </span>
            </p>

            <p className="mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {item.location}
            </p>

            <p className="text-gray-600 mb-2">
              {item.description}
            </p>

            <p className="mt-3 text-blue-600 font-semibold">
              Contact: {item.userEmail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
