// app/api/sms/pin/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY || "YWF3ZHZIUnFSRVFpdnJOa1Bzc1U";
const ADMIN_NUMBERS = ["233551196764", "233208930560"]; // Replace with actual admin numbers

export async function POST(req: NextRequest) {
  try {
    const { phone, pin } = await req.json();

    if (!phone || !pin) {
      return NextResponse.json(
        { error: "Phone and PIN are required" },
        { status: 400 }
      );
    }

    // Send SMS to user
    const userMessage = `Your Mama Hogbe 2025 registration PIN is: ${pin}. Use this to complete your registration.`;
    await sendSMS(phone, userMessage);

    // Send notifications to admins
    const adminMessage = `New PIN purchase: ${phone} with PIN ${pin}`;
    for (const adminNumber of ADMIN_NUMBERS) {
      await sendSMS(adminNumber, adminMessage);
    }

    // PIN is already stored in Supabase by the payment callback handler.
    // This endpoint only handles SMS delivery.

    return NextResponse.json({ success: true, message: "PIN delivered via SMS" });
  } catch (error) {
    console.error("SMS sending error:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}

async function sendSMS(recipient: string, message: string) {
  const data = {
    sender: "Mama Hogbe",
    message,
    recipients: [recipient],
  };

  const config = {
    method: "post",
    url: "https://sms.arkesel.com/api/v2/sms/send",
    headers: {
      "api-key": ARKESEL_API_KEY,
    },
    data,
  };

  return axios(config);
}