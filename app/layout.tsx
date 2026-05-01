import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayFlow CRM",
  description: "Smart PG Lead Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">

        {/* NAVBAR */}
        <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
  <h1 className="text-xl font-bold text-blue-600">StayFlow</h1>

  <div className="flex gap-6 text-sm font-medium text-gray-600">
    <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
    <Link href="/leads" className="hover:text-black">Leads</Link>
    <Link href="/pipeline" className="hover:text-black">Pipeline</Link>
    <Link href="/schedule" className="hover:text-black">Schedule</Link>
  </div>
</nav>

        {/* CONTENT */}
        <main className="flex-1 p-4">{children}</main>

      </body>
    </html>
  );
}