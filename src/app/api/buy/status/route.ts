import { NextRequest, NextResponse } from "next/server";

// This endpoint can be used by the frontend to check payment status if needed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientReference = searchParams.get("clientReference");
  if (!clientReference) {
    return NextResponse.json({ error: "Missing clientReference" }, { status: 400 });
  }
  try {
    const merchantId = process.env.HUBTEL_MERCHANT_ID || "2030508"; 
    const url = `https://api-txnstatus.hubtel.com/transactions/${merchantId}/status?clientReference=${clientReference}`;
    const hubtelRes = await fetch(url, {
      headers: {
        "Authorization": `Basic ${process.env.HUBTEL_BASIC_AUTH || "Mjl6OExSMTpiYTYyOGY2NzFmMDA0YmFhYjZiNmJlYTA4ZGZjZjQyZA=="}`,
      },
    });
    
    let data;
    let text;
    try {
      text = await hubtelRes.text();
      data = JSON.parse(text);
    } catch {
      console.error("[Hubtel Status Check - Invalid JSON]", text);
      return NextResponse.json({
        message: "Invalid response from Hubtel API (not JSON)",
        responseCode: "INVALID_JSON",
        data: text || null
      }, { status: 502 });
    }
    // Log the status check result for auditing/debugging (console log, similar to callback)
    console.log("Hubtel Status Check Response:", data);

    // If the responseCode is not '0000', treat as a failed status check
    if (data?.responseCode && data.responseCode !== "0000") {
      console.error("[Hubtel Status Check - FAILED]", new Date().toISOString(), data);
      return NextResponse.json({
        message: data?.message || "Failed to check status.",
        responseCode: data?.responseCode || "Unknown",
        data: data?.data || null
      }, { status: 500 });
    }

    // If status is Unpaid, Refunded, or not Paid, return with clear status
    const status = data?.data?.status;
    if (status && status !== "Paid") {
      return NextResponse.json({
        message: data?.message || `Status: ${status}`,
        responseCode: data?.responseCode || "0000",
        data: data?.data || null,
        status: status
      });
    }

    // Always return the expected structure for successful payment
    return NextResponse.json({
      message: data?.message || "Status check completed.",
      responseCode: data?.responseCode || "0000",
      data: data?.data || null,
      status: status || null
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({
      message: "Status check error",
      responseCode: "ERROR",
      data: null
    }, { status: 500 });
  }
}
