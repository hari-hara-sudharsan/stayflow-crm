"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter(); // ✅ FIX: create router instance

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      return alert("Enter email and password");
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/login", {
        email,
        password,
      });

      // 🔐 Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect after login
      router.push("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

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
          onClick={login}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full rounded-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔥 Signup Navigation */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}