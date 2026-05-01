"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || !password) {
      return alert("Enter email and password");
    }

    try {
      setLoading(true);

      await axios.post("/api/signup", {
        email,
        password,
      });

      alert("Account created successfully 🚀");

      // Redirect to login
      router.push("/login");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Create Account
        </h1>

        <input
          className="border p-2 w-full mb-3 rounded-md"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3 rounded-md"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded-md"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}