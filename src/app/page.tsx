"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Replace with your real auth logic
      if (phone === "23355" && pin === "1234") {
        router.push("/form");
      } else {
        setError("Invalid phone or PIN.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
      <div className="w-full max-w-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">
            Mama Hogbe 2025 Portal
          </h1>
          {/* Logo or Banner Image */}

          <Image
            src="/Banner.jpg"
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

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Don’t have a PIN?{" "}
            <a
              href="/buy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Buy one here
            </a>
          </p>
        </form>

        {/* Footer: Powered by Sendexa */}
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
          {/* <p>&copy; {new Date().getFullYear()} www.sendexa.co</p> */}
        </div>
      </div>
    </main>
  );
}
