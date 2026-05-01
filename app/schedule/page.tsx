"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Schedule() {
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Safe auth header
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
      setLoading(true);
      const res = await axios.get("/api/leads", config);
      setLeads(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
      else alert("Error fetching leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const scheduleVisit = async () => {
    if (!selectedLead || !date) {
      alert("Please select lead and date");
      return;
    }

    const config = getAuthHeader();
    if (!config) return;

    try {
      setLoading(true);

      await axios.put(
        "/api/leads",
        {
          id: selectedLead,
          status: "Visit Scheduled",
          visitDate: date,
        },
        config
      );

      alert("Visit Scheduled successfully 🚀");

      // 🔄 Refresh data
      fetchLeads();

      // 🧼 Reset form
      setSelectedLead("");
      setDate("");
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
      else alert("Error scheduling visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white p-6 rounded-2xl shadow border w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Schedule Visit
        </h1>

        {loading && (
          <p className="text-gray-400 text-sm mb-2 text-center">
            Loading...
          </p>
        )}

        <select
          className="border p-2 w-full mb-3 rounded-md"
          value={selectedLead}
          onChange={(e) => setSelectedLead(e.target.value)}
        >
          <option value="">Select Lead</option>
          {leads.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="border p-2 w-full mb-3 rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={scheduleVisit}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md w-full"
        >
          {loading ? "Scheduling..." : "Schedule Visit"}
        </button>
      </div>
    </div>
  );
}