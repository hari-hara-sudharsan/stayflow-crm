import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    // ✅ Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Find user (case-insensitive safe)
    const user = await User.findOne({ email });

    console.log("🔍 LOGIN TRY:", email);
    console.log("👤 USER FOUND:", !!user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    console.log("🔐 HASH:", user.password);

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("✅ PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1d" }
    );

    console.log("🎟 TOKEN CREATED");

    return NextResponse.json({
      token,
      message: "Login successful",
    });

  } catch (err: any) {
    console.error("🔥 LOGIN ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Login failed",
      },
      { status: 500 }
    );
  }
}