"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectBasedOnRole = async (uid: string, userEmail: string) => {
    if (!db) return;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: userEmail,
        role: "student",
      });
    }

    const updatedSnap = await getDoc(userRef);
    const role = updatedSnap.data()?.role;

    if (role === "admin") router.push("/admin");
    else if (role === "faculty") router.push("/faculty");
    else if (role === "authority") router.push("/authority");
    else router.push("/student");
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userEmail = result.user.email ?? "";
      await redirectBasedOnRole(result.user.uid, userEmail);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await redirectBasedOnRole(
        result.user.uid,
        result.user.email ?? ""
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email ?? email,
        role: "student",
      });

      router.push("/student");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-black px-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AEGIS Portal
        </h1>

        <p className="text-center text-gray-400 mb-6 text-sm">
          Secure Role Based Login
        </p>

        {errorMessage && (
          <div className="bg-red-500/20 text-red-400 p-2 mb-4 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleEmailLogin}
          disabled={loading}
          className="w-full py-3 mb-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Login"}
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 mb-4 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

      </div>
    </div>
  );
}
