"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Loader2, Lock, ReceiptCent, X } from "lucide-react";

export default function BuyPinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [pin] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [, setError] = React.useState<string | null>(null);
  const paymentAmount = "GH₵ 100";
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const handleGoToLogin = () => {
    router.push("/");
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);




  try {
    const res = await fetch("/api/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        clientReference: `MH25_${Date.now()}`.slice(0, 32),
        description: "Mama Hogbe 2025 Registration Form Purchase",
      }),
    });
    const data = await res.json();
    if (!res.ok || (!data.checkoutUrl && !data.checkoutDirectUrl)) {
      console.error("Payment API error response:", data);
      setError(data.error || "Failed to initiate payment.");
      setLoading(false);
      return;
    }
    if (data.checkoutUrl || data.checkoutDirectUrl) {
      setShowModal(true);
      setIframeUrl(data.checkoutDirectUrl ?? data.checkoutUrl);
    } else {
      setError("Unexpected response from payment API.");
    }
  } catch {
    setError("Network error. Please try again.");
    setLoading(false);
  }
};


const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIframeLoaded(false);
    setIframeUrl(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Mama Hogbe 2025 Portal</h1>
          <h2 className="text-lg text-gray-700">Buy Registration PIN</h2>
        </div>

        <Image
          src="/Banner.jpg"
          alt="Mama Hogbe Banner"
          width={600}
          height={100}
          className="w-full h-30 object-cover rounded"
        />

        {pin ? (
          <div className="space-y-4 text-center">
            <p className="text-lg font-medium">
              🎉 Your PIN is:{" "}
              <span className="font-bold text-black">{pin}</span>
            </p>
            <p className="text-sm text-gray-600">
              Use this PIN to log in and complete your registration.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
            >
              {loading ? "Processing..." : `Buy PIN (${paymentAmount})`}
            </button>
          </form>
        )}
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

        {/* Enhanced Iframe Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden mx-4">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center bg-blue-100 p-2 rounded-full">
                    <ReceiptCent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mama Hogbe 2025</h3>
                    <p className="text-sm text-gray-500">Secure checkout</p>
                  </div>
                </div>
                <button id="close-hubtel-iframe"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 transition p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Payment Info Bar */}
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Amount to Pay</span>
                  <span className="text-lg font-bold text-gray-900">{paymentAmount}</span>
                </div>
              </div>

              {/* Loading State */}
              {!iframeLoaded && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading secure payment gateway...</p>
                </div>
              )}
              {/* Iframe */}
              <iframe
                src={iframeUrl ?? ""}
                className={`w-full h-96 ${iframeLoaded ? "block" : "hidden"}`}
                title="Secure Payment Gateway"
                onLoad={handleIframeLoad}
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
              />


         

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <Lock className="h-3 w-3 mr-1 text-gray-400" />
                  Secured by Xtopay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

