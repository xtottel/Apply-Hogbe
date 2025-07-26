"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import Script from "next/script";

declare global {
  interface Window {
    CheckoutSdk?: {
      new (): {
        openModal: (options: object) => void;
      };
    };
  }
}

export default function BuyPinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [pin] = useState("");
  const [, setShowModal] = useState(false);
  const [, setError] = React.useState<string | null>(null);
  const paymentAmount = "GH₵ 2";
  // Store clientReference for status check
  const [, setClientReference] = useState<string | null>(null);

  const handleGoToLogin = () => {
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const generatedReference = `MH25_${Date.now()}`.slice(0, 32);
    setClientReference(generatedReference);

    try {
      const res = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          clientReference: generatedReference,
          description: "Mama Hogbe 2025 Registration Form Purchase",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Failed to initiate payment.");
        setLoading(false);
        return;
      }
      // Use Hubtel SDK modal
      if (window.CheckoutSdk) {
        const checkout = new window.CheckoutSdk();
        const purchaseInfo = {
          amount: 2, // Use actual amount
          purchaseDescription: "Mama Hogbe 2025 Registration Form Purchase",
          customerPhoneNumber: phone,
          clientReference: generatedReference,
        };
        const config = {
          branding: "enabled",
          callbackUrl:
            process.env.NEXT_PUBLIC_HUBTEL_CALLBACK_URL ||
            "https://apply.mamahogbepageant.com/api/buy/callback",
          merchantAccount:
            Number(process.env.NEXT_PUBLIC_HUBTEL_MERCHANT_ID) || 2020861,
          basicAuth:
            process.env.NEXT_PUBLIC_HUBTEL_BASIC_AUTH ||
            "cVp2SzFCMDpkMjFmODJhY2MxYmY0MDM0YjFkYjNlMWFmMjg3MTFjNQ==",
        };
        checkout.openModal({
          purchaseInfo,
          config,
          callBacks: {
            onInit: () => setLoading(false),
            onPaymentSuccess: () => {
              // Optionally check status via /api/buy/status
              // You can show a success message or redirect
              setShowModal(false);
              alert("Payment successful! Your PIN will be sent via SMS.");
            },
            onPaymentFailure: () => {
              setShowModal(false);
              setError("Payment failed. Please try again.");
            },
            onClose: () => setShowModal(false),
          },
        });
      } else {
        // fallback: redirect to Hubtel full page
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };



  return (
    <>
      <Script src="https://unified-pay.hubtel.com/js/v1/checkout.js" strategy="afterInteractive" />
      <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">Mama Hogbe 2025 Portal</h1>
            <h2 className="text-lg text-gray-700">Buy Registration PIN</h2>
          </div>

          <Image
            src="/101.jpg"
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
                className="w-full bg-blue-600 text-white py-2 rounded hover:opacity-90 transition"
              >
                {loading ? "Processing..." : `Buy PIN (${paymentAmount})`}
              </button>
            </form>
          )}
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
      </main>
    </>
  );
}

