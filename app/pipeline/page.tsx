"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const stages = ["New", "Contacted", "Visit Scheduled", "Booked"];

export default function Pipeline() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
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
      else alert("Error fetching pipeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.put("/api/leads", { id, status }, config);
      fetchLeads();
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
      else alert("Error updating status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pipeline</h1>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage);

          return (
            <div
              key={stage}
              className="bg-gray-100 p-3 rounded-xl min-h-[300px]"
            >
              <h2 className="font-semibold mb-2">{stage}</h2>

              {stageLeads.length === 0 && (
                <p className="text-gray-400 text-sm">No leads</p>
              )}

              {stageLeads.map((lead) => (
                <div
                  key={lead._id}
                  className={`p-3 rounded-lg mt-2 shadow border ${
                    lead.status === "New"
                      ? "bg-yellow-100"
                      : lead.status === "Contacted"
                      ? "bg-blue-100"
                      : lead.status === "Visit Scheduled"
                      ? "bg-purple-100"
                      : "bg-green-100"
                  }`}
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm">{lead.phone}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : ""}
                  </p>

                  <p className="text-xs font-semibold mt-1">
                    Priority: {lead.priority || "Medium"}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    👉 {lead.status === "New"
                      ? "Call immediately"
                      : lead.status === "Contacted"
                      ? "Schedule visit"
                      : lead.status === "Visit Scheduled"
                      ? "Follow up"
                      : "Closed"}
                  </p>

                  <select
                    className="mt-2 w-full text-sm p-1 rounded border"
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead._id, e.target.value)
                    }
                  >
                    {stages.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}