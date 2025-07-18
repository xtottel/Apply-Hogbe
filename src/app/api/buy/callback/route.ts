import { NextRequest, NextResponse } from "next/server";

// This endpoint will handle Hubtel payment callbacks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Hubtel Payment Callback:", body);

    // Log the callback response to the console for auditing/debugging (no file system write)
    console.log("[Hubtel Callback]", new Date().toISOString(), body);

    // Respond with the same structure as the sample callback
    // If payment failed, log and return the failure status and code
    if (body?.ResponseCode && body.ResponseCode !== "0000") {
      console.error("[Hubtel Callback - FAILED]", new Date().toISOString(), body);
      return NextResponse.json({
        ResponseCode: body.ResponseCode,
        Status: body?.Status ?? (body?.Data?.Status ?? "Failed"),
        Data: body?.Data ?? {},
        message: body?.Message || "Payment failed. See ResponseCode.",
      });
    }

    return NextResponse.json({
      ResponseCode: body?.ResponseCode ?? "0000",
      Status: body?.Status ?? (body?.Data?.Status ?? "Unknown"),
      Data: body?.Data ?? {},
    });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}