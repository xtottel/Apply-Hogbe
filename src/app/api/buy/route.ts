import { NextRequest, NextResponse } from "next/server";

// This API route will handle donation payment initiation using Hubtel
export async function OPTIONS() {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      // amount,
      FullName,
      Phone,
      clientReference,
      description = "Mama Hogbe 2025 Registration Form Purchase",
    } = body;

    // if (!amount || isNaN(amount) || amount < 1) {
    //   return NextResponse.json({ error: "Invalid donation amount." }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    // }

    // Prepare payload for Hubtel API
    const payload = {
      totalAmount: "100",
      description,
      callbackUrl: process.env.HUBTEL_CALLBACK_URL ?? "https://mamahogbe.sendexa.co/api/buy/callback",
      returnUrl: process.env.HUBTEL_RETURN_URL ?? "https://mamahogbe.sendexa.co/",
      merchantAccountNumber: process.env.HUBTEL_MERCHANT_ID ?? "2020861",
      cancellationUrl: process.env.HUBTEL_CANCEL_URL ?? "https://mamahogbe.sendexa.co",
      clientReference: clientReference || `MH25_${Date.now()}`.slice(0, 32),
      payeeName: FullName || undefined,
      payeeMobileNumber: Phone || undefined,
    };

    console.log("Hubtel API payload:", JSON.stringify(payload, null, 2));
    // Call Hubtel API
    const hubtelRes = await fetch("https://payproxyapi.hubtel.com/items/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${process.env.HUBTEL_BASIC_AUTH || "cVp2SzFCMDpkMjFmODJhY2MxYmY0MDM0YjFkYjNlMWFmMjg3MTFjNQ=="}`,
      },
      body: JSON.stringify(payload),
    });
    console.log("Hubtel response status:", hubtelRes.status, hubtelRes.statusText);

    const contentType = hubtelRes.headers.get("content-type");
    let data: unknown = null;
    if (contentType && contentType.includes("application/json")) {
      data = await hubtelRes.json();
    } else {
      const raw = await hubtelRes.text();
      console.error("Hubtel non-JSON response:", raw);
      return NextResponse.json({ error: "Payment provider error. Please try again later." }, { status: 502, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    type HubtelResponse = { status?: string; data?: { checkoutUrl?: string; checkoutDirectUrl?: string; checkoutId?: string; clientReference?: string } };
    const hubtelData = data as HubtelResponse;
    if (!hubtelRes.ok || !hubtelData.data?.checkoutUrl) {
      return NextResponse.json({ error: hubtelData?.status || "Failed to initiate payment." }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return NextResponse.json({
      checkoutUrl: hubtelData.data.checkoutUrl,
      checkoutDirectUrl: hubtelData.data.checkoutDirectUrl,
      checkoutId: hubtelData.data.checkoutId,
      clientReference: hubtelData.data.clientReference,
    }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.error("Donation API error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}
