// page.tsx
"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!phone || !pin) {
      toast.error("Phone number and PIN are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
        redirect: 'follow' // Important for handling redirects
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
      <div className="w-full max-w-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Keep your existing form JSX */}
          <h1 className="text-2xl font-semibold text-center">
            Mama Hogbe 2025 Portal
          </h1>

          <Image
            src="/101.jpg"
            alt="Mama Hogbe Banner"
            width={600}
            height={100}
            className="w-full h-30 object-cover rounded"
          />

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="2335XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="pin" className="block text-sm font-medium">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              placeholder="Your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Don&apos;t have a PIN?{" "}
            <a
              href="/buy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Buy one here
            </a>
          </p>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://xtopay.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Xtopay LLC
            </a>
          </p>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </main>
  );
}