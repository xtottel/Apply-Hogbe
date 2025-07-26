"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Basic validation
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Successful login - redirect to form
      router.push("/form");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format phone number as user types (optional)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setPhone(value);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
      <div className="w-full max-w-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">
            Mama Hogbe 2025 Portal
          </h1>

          <Image
            src="/101.jpg"
            alt="Mama Hogbe Banner"
            width={600}
            height={100}
            className="w-full h-30 object-cover rounded"
            priority
          />

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="0244000001"
              value={phone}
              onChange={handlePhoneChange} // Using the formatted change handler
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              required
              maxLength={10} // For Ghanaian numbers
              pattern="[0-9]{10}"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="pin" className="block text-sm font-medium">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              placeholder="Your 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} // Numbers only
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              required
              maxLength={4}
              pattern="[0-9]{4}"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-sm">
            Don&apos;t have a PIN?{" "}
            <a
              href="/buy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Get one here
            </a>
          </p>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://sendexa.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sendexa
            </a>
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
