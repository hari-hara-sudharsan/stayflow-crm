"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
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
      else alert("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const total = leads.length;
  const booked = leads.filter((l) => l.status === "Booked").length;
  const visits = leads.filter(
    (l) => l.status === "Visit Scheduled"
  ).length;

  const conversion = total
    ? ((booked / total) * 100).toFixed(1)
    : 0;

  // 🔥 Funnel
  const funnel = [
    { name: "New", count: leads.filter((l) => l.status === "New").length },
    {
      name: "Contacted",
      count: leads.filter((l) => l.status === "Contacted").length,
    },
    {
      name: "Visit",
      count: leads.filter((l) => l.status === "Visit Scheduled").length,
    },
    {
      name: "Booked",
      count: leads.filter((l) => l.status === "Booked").length,
    },
  ];

  // 🔥 Priority Count
  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  leads.forEach((l: any) => {
    if (l.priority && priorityCounts[l.priority as keyof typeof priorityCounts] !== undefined) {
      priorityCounts[l.priority as keyof typeof priorityCounts]++;
    }
  });

  // 🔥 Upcoming Visits
  const upcoming = leads.filter((l: any) => l.visitDate);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {loading && <p className="text-gray-400 mt-2">Loading...</p>}

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card title="Total Leads" value={total} />
        <Card title="Visits Scheduled" value={visits} />
        <Card title="Bookings" value={booked} />
        <Card title="Conversion %" value={`${conversion}%`} />
      </div>

      {/* FUNNEL */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold mb-3">Sales Funnel</h2>
        {funnel.map((f, i) => (
          <div key={i} className="mb-2">
            <p className="text-sm">{f.name}</p>
            <div className="bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{
                  width: total
                    ? `${(f.count / total) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* PRIORITY */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card title="High Priority" value={priorityCounts.High} />
        <Card title="Medium Priority" value={priorityCounts.Medium} />
        <Card title="Low Priority" value={priorityCounts.Low} />
      </div>

      {/* UPCOMING VISITS */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Upcoming Visits</h2>
        {upcoming.length === 0 && (
          <p className="text-gray-400">No visits scheduled</p>
        )}
        {upcoming.map((l: any) => (
          <div key={l._id} className="bg-white p-3 mt-2 rounded shadow">
            <p>{l.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(l.visitDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Recent Activity</h2>
        {leads.slice(0, 5).map((lead: any) => (
          <div key={lead._id} className="bg-white p-4 mt-2 rounded shadow">
            <p className="font-medium">{lead.name}</p>

            {lead.activity?.slice(-2).map((act: string, i: number) => (
              <p key={i} className="text-sm text-gray-500">
                • {act}
              </p>
            ))}

            <p className="text-xs text-gray-400 mt-1">
              {lead.createdAt
                ? new Date(lead.createdAt).toLocaleString()
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}