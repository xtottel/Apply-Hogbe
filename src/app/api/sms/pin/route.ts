// app/api/sms/pin/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ARKESEL_API_KEY =
  process.env.ARKESEL_API_KEY || "YWF3ZHZIUnFSRVFpdnJOa1Bzc1U";
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
    const userMessage = `Hi ${phone}, your PIN is ${pin}. Use it with your phone number to log in. Keep it safe.`;
    await sendSMS(phone, userMessage, "Mama Hogbe");

    // Send notifications to admins
    const adminMessage = `New PIN purchase alert: ${phone} has successfully purchased a PIN. Please record for financial tracking.`;
    for (const adminNumber of ADMIN_NUMBERS) {
      await sendSMS(adminNumber, adminMessage, "Xtottel Ltd");
    }

    return NextResponse.json({
      success: true,
      message: "PIN delivered via SMS",
    });
  } catch (error) {
    console.error("SMS sending error:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}

async function sendSMS(recipient: string, message: string, sender: string) {
  const data = {
    sender,
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
