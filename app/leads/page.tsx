"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [quickInput, setQuickInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Correct way
  const getAuthHeader = () => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchLeads = async () => {
    const config = getAuthHeader();
    if (!config) return;

    try {
      const res = await axios.get("/api/leads", config);
      setLeads(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
      else alert("Error fetching leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleQuickAdd = async () => {
    if (!quickInput) return alert("Enter lead details");

    const parts = quickInput.split(",");
    const name = parts[0]?.trim();
    const phone = parts[1]?.trim();

    if (!name || !phone) {
      return alert("Format: Name, Phone");
    }

    const config = getAuthHeader();
    if (!config) return;

    try {
      setLoading(true);

      await axios.post(
        "/api/leads",
        { name, phone, status: "New" },
        config
      );

      setQuickInput("");
      fetchLeads();
      alert("Lead added successfully 🚀");
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
      else alert("Error adding lead");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((l: any) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold">Leads</h1>

      <input
        placeholder="Search leads..."
        className="border p-2 w-full mt-4 rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-4 bg-white p-4 rounded-xl shadow border">
        <p className="text-sm text-gray-500 mb-2">
          Quick Add (e.g. Hari, 9876543210)
        </p>

        <input
          className="border p-2 w-full rounded-md"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
        />

        <button
          onClick={handleQuickAdd}
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Adding..." : "Add Lead"}
        </button>
      </div>

      <div className="mt-6">
        {filteredLeads.map((lead: any) => (
          <div key={lead._id} className="bg-white p-4 mt-2 rounded shadow">
            <p className="font-semibold">{lead.name}</p>
            <p>{lead.phone}</p>
            <p className="text-sm text-gray-500">{lead.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}