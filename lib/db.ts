// lib/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log(" MongoDB connected");
    } catch (err) {
        console.error(" Mongo connection error:", err);
    }
};