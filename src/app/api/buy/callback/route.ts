// app/api/buy/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(req: NextRequest) {
  try {
    // No sequelize, using Supabase
    const body = await req.json();
    console.log('Hubtel Payment Callback:', body);

    // If payment was successful
    if (body?.ResponseCode === '0000' && body?.Data?.Status === 'Paid') {
      const { clientReference, payeeMobileNumber } = body.Data;
      
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
      }

      // Send SMS with the PIN (you'll call your SMS API here)
      try {
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
          console.error("Failed to send SMS:", await smsResponse.text());
        }

        // TODO: Store the PIN in your database along with clientReference
        // This would typically be a MySQL insert operation

      } catch (smsError) {
        console.error("SMS sending failed:", smsError);
      }
    
    }

    return NextResponse.json({
      ResponseCode: body?.ResponseCode ?? '0000',
      Status: body?.Status ?? (body?.Data?.Status ?? 'Unknown'),
      Data: body?.Data ?? {},
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback error' }, { status: 500 });
  }
}