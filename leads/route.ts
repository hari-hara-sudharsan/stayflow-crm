import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";

// 🔐 Helper function
function checkAuth(req: Request) {
  const token = req.headers.get("authorization");

  if (!token) {
    return false;
  }

  return true;
}

// GET ALL LEADS
export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 });
  return Response.json(leads);
}

// CREATE LEAD
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const score =
    (body.budget > 10000 ? 50 : 20) +
    (body.preferred_location ? 20 : 0) +
    10;

  const priority =
    score > 60 ? "High" : score > 40 ? "Medium" : "Low";

  const lead = await Lead.create({
    ...body,
    score,
    priority,
    activity: ["Lead created"],
  });

  return Response.json(lead);
}

// UPDATE LEAD
export async function PUT(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, visitDate } = await req.json();
  await connectDB();

  const lead = await Lead.findById(id);

  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }

  if (status && status !== lead.status) {
    lead.activity.push(`Status changed to ${status}`);
    lead.status = status;
  }

  if (visitDate) {
    lead.visitDate = visitDate;
    lead.activity.push(
      `Visit scheduled on ${new Date(visitDate).toLocaleString()}`
    );
  }

  await lead.save();

  return Response.json(lead);
}