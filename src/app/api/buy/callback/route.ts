import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function normalizeGhanaPhone(phone: string): string {
  if (phone.startsWith('233') && phone.length === 12) {
    return '0' + phone.slice(3);
  }
  return phone;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Hubtel Payment Callback:', body);

    const status = body?.Data?.Status || body?.Status;

    if (body?.ResponseCode === '0000' && (status === 'Paid' || status === 'Success')) {
      const clientReference = body.Data?.ClientReference || body.Data?.clientReference;
      const rawPhone = body.Data?.payeeMobileNumber || body.Data?.CustomerPhoneNumber;
      const phone = normalizeGhanaPhone(rawPhone);

      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      const { error: pinError } = await supabase
        .from('users')
        .insert({
          phone,
          pin,
          client_reference: clientReference,
          used_pin: false, // corrected key name from `used` to `used_pin`
        });

      if (pinError) {
        console.error('Failed to store PIN in Supabase:', pinError);
        return NextResponse.json({
          ResponseCode: 'PIN_DB_ERROR',
          Status: 'Failed',
          Data: { error: pinError.message },
        }, { status: 500 });
      }

      const smsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/sms/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });

      if (!smsResponse.ok) {
        const smsErrorText = await smsResponse.text();
        console.error("Failed to send SMS:", smsErrorText);
        return NextResponse.json({
          ResponseCode: 'SMS_ERROR',
          Status: 'Failed',
          Data: { error: smsErrorText },
        }, { status: 500 });
      }

      return NextResponse.json({
        ResponseCode: '0000',
        Status: status,
        Data: { clientReference, phone, pin },
      });
    }

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
