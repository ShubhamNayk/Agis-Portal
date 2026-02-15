"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const role = userSnap.data()?.role;

        if (role === "admin") router.push("/admin");
        else if (role === "faculty") router.push("/faculty");
        else if (role === "authority") router.push("/authority");
        else router.push("/student");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
