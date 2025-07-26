import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { phone, pin } = await req.json();

    if (!phone || !pin) {
      return NextResponse.json(
        { success: false, message: 'Phone and PIN are required.' },
        { status: 400 }
      );
    }

    // Step 1: Check if user exists with the phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, pin, used_pin')
      .eq('phone', phone.trim())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Phone number not registered.' },
        { status: 404 }
      );
    }

    // Step 2: Check if the PIN matches
    if (user.pin !== pin) {
      return NextResponse.json(
        { success: false, message: 'Incorrect PIN.' },
        { status: 401 }
      );
    }

    // Step 3: Check if PIN was already used
    if (user.used_pin) {
      return NextResponse.json(
        { success: false, message: 'PIN has already been used.' },
        { status: 403 }
      );
    }

    // Optional: Mark the PIN as used
    await supabase
      .from('users')
      .update({ used_pin: true })
      .eq('id', user.id);

    // Create success response with cookies
    const response = NextResponse.json(
      { success: true, message: 'Login successful.' },
      { status: 200 }
    );

    response.cookies.set('auth_token', user.id.toString(), {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    response.cookies.set('authenticated', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
