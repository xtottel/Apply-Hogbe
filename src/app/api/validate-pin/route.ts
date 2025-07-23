// app/api/validate-pin/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { phone, pin } = await request.json();

    if (!phone || !pin) {
      return NextResponse.json(
        { error: 'Phone and PIN are required' },
        { status: 400 }
      );
    }

    // Check if valid PIN exists
    const { data: pinData, error: pinError } = await supabase
      .from('pins')
      .select('id, client_reference')
      .eq('phone', phone)
      .eq('pin', pin)
      .eq('used', false)
      .single();

    if (pinError || !pinData) {
      return NextResponse.json(
        { error: 'Invalid PIN or already used. Please check your PIN or purchase a new one.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'PIN is valid',
      clientReference: pinData.client_reference,
      pinId: pinData.id
    });
  } catch (error) {
    console.error('PIN validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}