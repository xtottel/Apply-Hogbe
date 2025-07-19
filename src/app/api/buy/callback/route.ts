// app/api/buy/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Hubtel Payment Callback:', body);

    // Accept both 'Paid' and 'Success' as successful payment
    const status = body?.Data?.Status || body?.Status;
    if (body?.ResponseCode === '0000' && (status === 'Paid' || status === 'Success')) {
      // Use payeeMobileNumber or fallback to CustomerPhoneNumber
      const clientReference = body.Data?.ClientReference || body.Data?.clientReference;
      const payeeMobileNumber = body.Data?.payeeMobileNumber || body.Data?.CustomerPhoneNumber;

      // Generate a random 4-digit PIN
      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      // Store PIN in Supabase
      const { error: pinError } = await supabase
        .from('pins')
        .insert({
          phone: payeeMobileNumber,
          pin,
          client_reference: clientReference,
          used: false
        });
      if (pinError) {
        console.error('Failed to store PIN in Supabase:', pinError);
        return NextResponse.json({
          ResponseCode: 'PIN_DB_ERROR',
          Status: 'Failed',
          Data: { error: pinError.message }
        }, { status: 500 });
      }

      // Send SMS with the PIN
      const smsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/sms/pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: payeeMobileNumber,
          pin,
        }),
      });

      if (!smsResponse.ok) {
        const smsErrorText = await smsResponse.text();
        console.error("Failed to send SMS:", smsErrorText);
        return NextResponse.json({
          ResponseCode: 'SMS_ERROR',
          Status: 'Failed',
          Data: { error: smsErrorText }
        }, { status: 500 });
      }

      // If everything succeeded, return success response
      return NextResponse.json({
        ResponseCode: '0000',
        Status: status,
        Data: { clientReference, payeeMobileNumber, pin }
      });
    }

    // For all other cases, return the original callback data
    return NextResponse.json({
      ResponseCode: body?.ResponseCode ?? '0000',
      Status: status ?? 'Unknown',
      Data: body?.Data ?? {},
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback error' }, { status: 500 });
  }
}