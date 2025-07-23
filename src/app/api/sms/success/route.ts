// // app/api/sms/success/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY || "YWF3ZHZIUnFSRVFpdnJOa1Bzc1U";

// export async function POST(req: NextRequest) {
//   try {
//     const { phone, fullName } = await req.json();

//     if (!phone || !fullName) {
//       return NextResponse.json(
//         { error: "Phone and full name are required" },
//         { status: 400 }
//       );
//     }

//     const message = `Dear ${fullName}, your registration for Mama Hogbe 2025 has been received successfully. We'll contact you soon with audition details. Keep your phone handy!`;
    
//     await sendSMS(phone, message, "Mama Hogbe");

//     return NextResponse.json({
//       success: true,
//       message: "Confirmation SMS sent successfully",
//     });
//   } catch (error) {
//     console.error("SMS sending error:", error);
//     return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
//   }
// }

// async function sendSMS(recipient: string, message: string, sender: string) {
//   const data = {
//     sender,
//     message,
//     recipients: [recipient],
//   };

//   const config = {
//     method: "post",
//     url: "https://sms.arkesel.com/api/v2/sms/send",
//     headers: {
//       "api-key": ARKESEL_API_KEY,
//     },
//     data,
//   };

//   return axios(config);
// }


import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY || "YWF3ZHZIUnFSRVFpdnJOa1Bzc1U";

export async function POST(req: NextRequest) {
  try {
    const { phone, fullName } = await req.json();

    if (!phone || !fullName) {
      return NextResponse.json(
        { error: "Phone and full name are required" },
        { status: 400 }
      );
    }

    const message = `Dear ${fullName}, your registration for Mama Hogbe 2025 has been received successfully. We'll contact you soon with audition details. Keep your phone handy!`;
    
    const response = await sendSMS(phone, message, "Mama Hogbe");

    return NextResponse.json({
      success: true,
      message: "Confirmation SMS sent successfully",
      smsResponse: response.data
    });
  } catch (error) {
    console.error("SMS sending error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send SMS",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
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
      "Content-Type": "application/json"
    },
    data,
  };

  return axios(config);
}